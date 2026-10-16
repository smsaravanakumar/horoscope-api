'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('express');
// Freeze transit time so optional baseline comparison is deterministic.
const RealDate=Date;
global.Date=class extends RealDate {
 constructor(...args){super(...(args.length?args:['2026-10-15T12:00:00Z']));}
 static now(){return new RealDate('2026-10-15T12:00:00Z').getTime();}
};
const {buildClientChartCalculations}=require('../services/clientChartCalculationsService');
async function start(routeFile){
 const geo=path.resolve(path.dirname(routeFile),'../services/geocodeService.js');
 require(geo);require.cache[geo].exports={...require.cache[geo].exports,
  getCoordinates:async()=>{throw new Error('External geocoder forbidden in integration test');}};
 const app=express();app.use(express.json());app.use('/api/horoscope',require(routeFile));
 return await new Promise(resolve=>{const server=app.listen(0,'127.0.0.1',()=>resolve(server));});
}
async function post(server,language){
 const response=await fetch(`http://127.0.0.1:${server.address().port}/api/horoscope/generate`,{
 method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
 name:'API UAT',gender:'male',birthDate:'1991-05-05',birthTime:'07:52',
 place:'Kanniyakumari, Tamil Nadu, India',latitude:8.0883,longitude:77.5385,language})});
 assert.equal(response.status,200);return response.json();
}
(async()=>{
 let updated,baseline;
 try {
 updated=await start(path.resolve(__dirname,'../routes/horoscope.js'));
 if(process.env.API_BASELINE_ROOT) baseline=await start(path.resolve(process.env.API_BASELINE_ROOT,'routes/horoscope.js'));
 for(const language of ['ta','en']){
  const body=await post(updated,language), c=body.clientChartCalculations;
  assert.ok(c && c.thithiSoonyaRasi.evaluated && c.karakamsa.evaluated);
  assert.equal(c.shashtiamsa.division,60);assert.equal(c.navamsaDetails.division,9);
  assert.deepEqual(c,buildClientChartCalculations({...body,language}));
  for(let i=1;i<=12;i++) assert.equal(c.navamsaDetails.chart[i].map(p=>p.name).join('\n'),body.navamsaChart[i]);
  assert.deepEqual(c.mudakkuRasi,body.horoscopeDetails.mudakku);
  assert.deepEqual(c.yogiAvayogi,body.horoscopeDetails.yogiAvayogi);
  console.log(`PASS ${language}: HTTP response, D9 positions, D60, Karakamsa, Thithi Soonya, existing values`);
  if(baseline){
   const original=await post(baseline,language);delete body.clientChartCalculations;
   assert.deepEqual(body,original);
   console.log(`PASS ${language}: ALL previous response fields deep-equal latest uploaded baseline`);
  }
 }
 }finally{
  for(const s of [updated,baseline]) if(s) {s.closeAllConnections();await new Promise(r=>s.close(r));}
  global.Date=RealDate;
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
