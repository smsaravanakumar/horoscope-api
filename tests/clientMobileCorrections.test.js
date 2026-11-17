'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {buildPlanetaryStates,findStation}=require('../services/clientPlanetaryStatesService');
const {buildDashaTimeline}=require('../services/birthCalculationDetailsService');
const {resolveTempleReferences}=require('../services/clientTempleReferenceService');
const {getPlanetPositions}=require('../services/astronomyService');
const {enrichPlanets}=require('../services/astrologyService');
test('all twelve first houses share client temple; shifted sequences checked',()=>{
  for(let i=1;i<=12;i++) assert.match(resolveTempleReferences({horoscopeDetails:{mudakku:{rasiNumber:i}},mudakkuHouseNumber:1}).mudakkuHouseTemple.temple,/இம்மையிலும்/);
  for(const [rasi,house,pattern] of [[4,2,/சந்திர/],[5,2,/நரசிம்ம/],[9,3,/சுவாமிமலை/],[10,3,/சுப்பிரமணிய/]]) assert.match(resolveTempleReferences({horoscopeDetails:{mudakku:{rasiNumber:rasi}},mudakkuHouseNumber:house}).mudakkuHouseTemple.temple,pattern);
  const n=resolveTempleReferences({}).mudakkuNodeReference; assert.equal(n.groups.rahu.length,12);assert.equal(n.groups.ketu.length,12);
});
test('exchange, combustion, no mutation, and synthetic retrograde boundaries',()=>{
  const date=new Date('2026-11-17T00:00:00Z');
  const data=[{key:'moon',name:'Moon',rasiNo:1,longitude:53.4},{key:'mars',name:'Mars',rasiNo:4,longitude:40,combust:true},{key:'mandi',name:'Mandi',rasiNo:1,longitude:0}];
  const snapshot=JSON.stringify(data);
  const start=date.getTime()-2.5*86400000,end=date.getTime()+3.5*86400000;
  const speed=(key,d)=>d.getTime()>start&&d.getTime()<end?-1:1;
  const result=buildPlanetaryStates({planets:data,date,speed});
  assert.deepEqual(result.signExchanges[0].planetKeys,['moon','mars']);
  assert.deepEqual(result.nakshatraExchanges[0].planetKeys,['moon','mars']);
  assert.equal(result.combustPlanets[0].planetKey,'mars');
  assert.ok(Math.abs(findStation('mars',date,-1,speed).getTime()-start)<60000);
  assert.ok(Math.abs(findStation('mars',date,1,speed).getTime()-end)<60000);
  assert.equal(JSON.stringify(data),snapshot);
});
test('real ephemeris periods bracket current instant and agree with frozen speed flags',()=>{
  const date=new Date('2026-11-17T00:00:00Z');
  const planets=enrichPlanets(getPlanetPositions(date).planets,'en');
  const result=buildPlanetaryStates({planets,date});
  for(const p of result.retrogradePeriods){assert.equal(p.retrograde,planets.find(x=>x.key===p.planetKey).retrograde);if(p.retrograde){assert.ok(Date.parse(p.startIsoUtc)<date.getTime());assert.ok(Date.parse(p.endIsoUtc)>date.getTime());}else assert.equal(p.startIsoUtc,null);}
});
test('Antaram is contained in Bhukti and independent of language',()=>{
  const birthDate=new Date('1975-04-12T00:00:00Z'),currentDate=new Date('2026-11-17T00:00:00Z');
  const args={birthDate,currentDate,moon:{longitude:123}};
  const a=buildDashaTimeline({...args,language:'ta'}),b=buildDashaTimeline({...args,language:'en'});
  assert.equal(a.currentAntaram.key,b.currentAntaram.key);assert.equal(a.currentAntaram.endIsoUtc,b.currentAntaram.endIsoUtc);
  assert.ok(Date.parse(a.currentAntaram.startIsoUtc)>=Date.parse(a.currentBhukti.startIsoUtc));assert.ok(Date.parse(a.currentAntaram.endIsoUtc)<=Date.parse(a.currentBhukti.endIsoUtc));
  assert.ok(Date.parse(a.currentAntaram.startIsoUtc)<=currentDate.getTime()&&Date.parse(a.currentAntaram.endIsoUtc)>currentDate.getTime());
});
