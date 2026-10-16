'use strict';
const assert = require('node:assert/strict');
const {test} = require('node:test');
const {buildClientChartCalculations,buildThithiSoonya,position,referenceLagna} = require('../services/clientChartCalculationsService');
const {buildNavamsaChart} = require('../services/astrologyService');
// Astro-Vision LifeSign public sample, printed pages 4 and 13.
const sample = [
 ['lagna',165,36,38,1,2],['moon',172,47,8,3,4],['sun',256,36,51,6,5],
 ['mercury',273,18,42,4,10],['venus',233,48,24,7,11],['mars',356,22,59,4,11],
 ['jupiter',33,2,11,8,10],['saturn',251,51,40,8,4],['rahu',314,5,41,3,11],
 ['ketu',134,5,41,9,5],['gulika',161,5,54,4,1],
];
const bodies=sample.map(([key,d,m,s])=>({key,name:key,longitude:d+m/60+s/3600,rasiNo:Math.floor(d/30)+1}));
const lagna=bodies[0],planets=bodies.slice(1);
const horoscopeDetails={tithi:{number:24,name:'Navami'},mudakku:{rasiNumber:5},
 yogiAvayogi:{yogi:{planetKey:'moon'},avayogi:{planetKey:'sun'}}};
const input={lagna,planets,horoscopeDetails,language:'en'};

test('D60 reproduces all 11 Astro-Vision published sample signs',()=>{
 for(const [i,row] of sample.entries()) assert.equal(position(bodies[i],60,'en').rasiNo,row[4],row[0]);
});
test('D9 reproduces all 11 sample signs and preserves existing chart positions',()=>{
 const result=buildClientChartCalculations(input).navamsaDetails;
 for(const [i,row] of sample.entries()) assert.equal(position(bodies[i],9,'en').rasiNo,row[5],row[0]);
 const old=buildNavamsaChart({lagna,planets});
 for(let i=1;i<=12;i++) assert.equal(result.chart[i].map(p=>p.name).join('\n'),old[i]);
 assert.equal(result.planets.find(p=>p.key==='mercury').degreeDms.text,'29:48:18');
});
test('client D9-degree rule differs from traditional natal-degree Karakamsa',()=>{
 const r=buildClientChartCalculations(input);
 assert.equal(r.karakamsa.selectedPlanetKey,'mercury');assert.equal(r.karakamsa.lagna.rasiNo,10);
 assert.equal(r.traditionalKarakamsa.selectedPlanetKey,'mars');assert.equal(r.traditionalKarakamsa.lagna.rasiNo,11);
 assert.equal(r.karakamsa.planets.find(p=>p.key==='mercury').houseFromReferenceLagna,1);
 assert.deepEqual(r.karakamsa.planets.map(p=>p.rasiNo),r.navamsaDetails.planets.map(p=>p.rasiNo));
});
test('all 30 tithis, both pakshas, full/new moon and four-sign Chaturdashi',()=>{
 const expected=[[7,10],[9,12],[5,10],[2,11],[3,6],[1,5],[4,9],[3,6],[5,8],[5,8],[9,12],[7,10],[2,5],[3,6,9,12],[]];
 for(let n=1;n<=30;n++) assert.deepEqual(buildThithiSoonya({number:n},'en').rasiNumbers,expected[(n-1)%15]);
 for(const number of [null,0,31,1.5,'9',NaN]) assert.equal(buildThithiSoonya({number}).evaluated,false);
});
test('D60 half-degree boundaries, sign crossing, normalization and numeric rejection',()=>{
 assert.equal(position({longitude:30.499999},60,'en').rasiNo,2);
 assert.equal(position({longitude:30.5},60,'en').rasiNo,3);
 assert.equal(position({longitude:60},60,'en').rasiNo,3);
 assert.equal(position({longitude:360},60,'en').rasiNo,1);
 assert.equal(position({longitude:-0.1},60,'en').rasiNo,11);
 for(const longitude of [NaN,Infinity,null,'30']) assert.throws(()=>position({longitude},60,'en'));
});
test('ties do not silently pick an arbitrary planet; seven planets are required',()=>{
 const p=buildClientChartCalculations(input).navamsaDetails.planets;
 assert.equal(referenceLagna(p.map(x=>({...x,degreeInSign:15})),'d9','en').reason,'equal_degree_tie_requires_rule');
 assert.equal(referenceLagna(p.filter(x=>x.key!=='sun'),'d9','en').evaluated,false);
});
test('nodes/upagrahas excluded from ranking; retrograde does not reverse degrees',()=>{
 const p=buildClientChartCalculations(input).navamsaDetails.planets;
 const altered=p.map(x=>({...x,retrograde:true,degreeInSign:['rahu','ketu','gulika'].includes(x.key)?29.99999:x.degreeInSign}));
 assert.equal(referenceLagna(altered,'d9','en').selectedPlanetKey,'mercury');
});
test('reuses existing Mudakku/Yogi values; preserves overlapping indicators',()=>{
 const r=buildClientChartCalculations(input);
 assert.deepEqual(r.mudakkuRasi,horoscopeDetails.mudakku);assert.deepEqual(r.yogiAvayogi,horoscopeDetails.yogiAvayogi);
 assert.deepEqual(r.rasiChartIndicators.signs['5'].map(x=>x.type),['thithiSoonya','mudakku']);
 assert.equal(r.rasiChartIndicators.signs['6'][0].type,'yogi');assert.equal(r.rasiChartIndicators.signs['9'][0].type,'avayogi');
});
test('input unchanged and Tamil/English share numeric calculations',()=>{
 const before=JSON.stringify(input);const en=buildClientChartCalculations(input);
 const ta=buildClientChartCalculations({...input,language:'ta'});
 assert.equal(JSON.stringify(input),before);assert.deepEqual(ta.thithiSoonyaRasi.rasiNumbers,en.thithiSoonyaRasi.rasiNumbers);
 assert.equal(ta.shashtiamsa.lagna.rasiNo,en.shashtiamsa.lagna.rasiNo);assert.equal(ta.shashtiamsa.lagna.rasi,'மேஷம்');
});
