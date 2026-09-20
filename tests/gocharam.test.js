const assert = require('assert');
const { buildCurrentGocharam } = require('../services/gocharamService');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed += 1; console.log(`PASS: ${name}`); }
  catch (error) { failed += 1; console.log(`FAIL: ${name}`); console.error(error.message); }
}

const rawPlanets = [
  ['sun','சூரியன்','Sun',150], ['moon','சந்திரன்','Moon',170],
  ['mercury','புதன்','Mercury',160], ['venus','சுக்கிரன்','Venus',140],
  ['mars','செவ்வாய்','Mars',200], ['jupiter','குரு','Jupiter',110],
  ['saturn','சனி','Saturn',350], ['rahu','ராகு','Rahu',300], ['ketu','கேது','Ketu',120],
].map(([key,ta,en,siderealLongitude]) => ({key,ta,en,siderealLongitude,speed:0}));

function fakeEnrich(items, language) {
  return items.map((p) => ({
    key:p.key,
    name: language === 'ta' ? p.ta : p.en,
    longitude:p.siderealLongitude,
    rasi:'Test Rasi', rasiNo:(Math.floor(p.siderealLongitude/30)%12)+1,
    nakshatra:'Test Nakshatra', pada:1,
  }));
}

const deps = {
  getPlanetPositions: () => ({
    ayanamsa:24.2,
    planets: rawPlanets.map(p => ({...p})),
    lagna:{key:'lagna',ta:'லக்னம்',en:'Lagna',siderealLongitude:45,speed:0},
  }),
  getMandiPosition: () => ({key:'mandi',ta:'மாந்தி',en:'Mandi',siderealLongitude:75,speed:0}),
  enrichPlanets: fakeEnrich,
  buildSouthIndianChart: () => Object.fromEntries(Array.from({length:12},(_,i)=>[String(i+1),''])),
  buildHouseChart: () => Object.fromEntries(Array.from({length:12},(_,i)=>[String(i+1),''])),
};

const sampleDate = new Date('2026-09-20T12:30:00.000Z');
const gocharam = buildCurrentGocharam({date:sampleDate,latitude:10.0731,longitude:78.7802,language:'ta',place:'Karaikudi',_deps:deps});

test('Gocharam is evaluated',()=>assert.strictEqual(gocharam.evaluated,true));
test('Current instant is retained',()=>assert.strictEqual(gocharam.dateTimeUtc,sampleDate.toISOString()));
test('Transit type is identified',()=>assert.strictEqual(gocharam.type,'current_gocharam'));
test('Reference place is retained',()=>assert.strictEqual(gocharam.referencePlace,'Karaikudi'));
test('Coordinates are retained',()=>assert.deepStrictEqual(gocharam.coordinates,{latitude:10.0731,longitude:78.7802}));
test('Current Lagna is returned',()=>assert.ok(gocharam.lagna && gocharam.lagna.key==='lagna'));
test('All nine classical grahas are returned',()=>{const k=new Set(gocharam.planets.map(p=>p.key)); ['sun','moon','mars','mercury','jupiter','venus','saturn','rahu','ketu'].forEach(x=>assert.ok(k.has(x)));});
test('Mandi remains structurally consistent',()=>assert.ok(gocharam.planets.some(p=>p.key==='mandi')));
test('Every current planet has Rasi/Nakshatra/Pada',()=>gocharam.planets.forEach(p=>{assert.ok(p.rasi);assert.ok(p.nakshatra);assert.ok(p.pada>=1&&p.pada<=4);}));
test('South Indian current chart has 12 signs',()=>assert.strictEqual(Object.keys(gocharam.chart).length,12));
test('Current house chart has 12 houses',()=>assert.strictEqual(Object.keys(gocharam.houseChart).length,12));
test('Tamil localization is passed through',()=>assert.strictEqual(gocharam.planets.find(p=>p.key==='sun').name,'சூரியன்'));
const en=buildCurrentGocharam({date:sampleDate,latitude:10.0731,longitude:78.7802,language:'en',place:'Karaikudi',_deps:deps});
test('English localization is passed through',()=>assert.strictEqual(en.planets.find(p=>p.key==='sun').name,'Sun'));
test('Birth date/time are not required by Gocharam service',()=>assert.ok(gocharam.dateTimeUtc));
test('Ayanamsa is returned',()=>assert.strictEqual(gocharam.ayanamsa,24.2));

console.log(''); console.log(`TOTAL PASS : ${passed}`); console.log(`TOTAL FAIL : ${failed}`); console.log('');
if (failed===0) { console.log('CURRENT GOCHARAM BASIC UAT: PASS'); process.exit(0); }
console.log('CURRENT GOCHARAM BASIC UAT: FAIL'); process.exit(1);
