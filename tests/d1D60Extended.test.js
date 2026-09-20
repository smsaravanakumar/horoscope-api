const assert = require('assert');
const {
  buildD1D60Analysis,
  getExtendedVargaLongitude,
  longitudeDetails,
} = require('../services/d1D60AnalysisService');

let pass = 0;
let fail = 0;
function test(name, fn) {
  try { fn(); console.log(`PASS: ${name}`); pass++; }
  catch (e) { console.log(`FAIL: ${name}`); console.log(`      ${e.message}`); fail++; }
}
function p(key, name, longitude, rasiNo, combust=false) {
  return { key, name, longitude, rasiNo, combust };
}

const lagna = { key:'lagna', name:'லக்னம்', longitude:13.25, rasiNo:1 };
const planets = [
  p('sun','சூரியன்',180.1,7),
  p('moon','சந்திரன்',31.1,2),
  p('mars','செவ்வாய்',90.1,4),
  p('mercury','புதன்',331.1,12,true),
  p('jupiter','குரு',271.1,10),
  p('venus','சுக்கிரன்',151.1,6),
  p('saturn','சனி',1.1,1),
  p('rahu','ராகு',61.1,3),
  p('ketu','கேது',241.1,9),
  p('mandi','மாந்தி',300,11),
];
const dasha = { currentDasha:'சனி', currentBhukti:'புதன்' };
const out = buildD1D60Analysis({ lagna, planets, dasha, language:'ta' });

test('Extended D1-D60 phase is implemented', () => {
  assert.strictEqual(out.extendedD1D60.status, 'implemented');
  assert.strictEqual(out.extendedD1D60.evaluatedCharts.length, 60);
});

test('Existing frozen foundation metadata is preserved', () => {
  assert.strictEqual(out.phase, 'D1_D9_D60_FOUNDATION');
  assert.deepStrictEqual(out.evaluatedCharts, ['D1','D9','D60']);
});

test('Exactly 60 divisional charts are returned', () => {
  assert.strictEqual(out.divisionalCharts.length, 60);
  assert.strictEqual(out.divisionalCharts[0].chart, 'D1');
  assert.strictEqual(out.divisionalCharts[59].chart, 'D60');
});

test('Each divisional chart contains Lagna and nine classical grahas', () => {
  for (const chart of out.divisionalCharts) {
    assert(chart.lagna && chart.lagna.rasiNo >= 1 && chart.lagna.rasiNo <= 12);
    assert.strictEqual(chart.planets.length, 9);
  }
});

test('D1 transformed longitude preserves natal longitude', () => {
  assert(Math.abs(getExtendedVargaLongitude(31.1, 1) - 31.1) < 1e-9);
});

test('D9 transformed sign agrees with frozen Navamsa for sample Moon', () => {
  const d9 = out.divisionalCharts.find(c => c.division === 9);
  const moonD9 = d9.planets.find(p => p.key === 'moon');
  const frozenMoon = out.planets.find(p => p.key === 'moon').d9;
  assert.strictEqual(moonD9.rasiNo, frozenMoon.rasiNo);
});

test('Nakshatra and Pada are returned for every D1-D60 Lagna', () => {
  for (const chart of out.divisionalCharts) {
    assert(chart.lagna.nakshatraNo >= 1 && chart.lagna.nakshatraNo <= 27);
    assert(chart.lagna.pada >= 1 && chart.lagna.pada <= 4);
  }
});

test('Nakshatra frequency counts exactly 60 charts', () => {
  const total = out.nakshatraFrequency.all.reduce((sum, x) => sum + x.count, 0);
  assert.strictEqual(total, 60);
});

test('Top two Nakshatras are returned', () => {
  assert.strictEqual(out.nakshatraFrequency.topTwo.length, 2);
  assert(out.nakshatraFrequency.topTwo[0].count >= out.nakshatraFrequency.topTwo[1].count);
});

test('Bottom two are least-frequent Nakshatras that actually occurred', () => {
  assert.strictEqual(out.nakshatraFrequency.bottomTwo.length, 2);
  assert(out.nakshatraFrequency.bottomTwo.every(x => x.count >= 1));
  assert(out.nakshatraFrequency.bottomTwo[0].count <= out.nakshatraFrequency.bottomTwo[1].count);
});

test('Frequency entries retain the D-chart occurrence list', () => {
  for (const row of out.nakshatraFrequency.all) assert.strictEqual(row.charts.length, row.count);
});

test('Every planet now has all 60 Varga results', () => {
  for (const planet of out.planets) assert.strictEqual(planet.allVargas.length, 60);
});

test('Affected count matches affected chart list', () => {
  for (const planet of out.planets) {
    assert.strictEqual(planet.affectedCount, planet.affectedCharts.length);
    assert.strictEqual(planet.affectedCount, planet.allVargas.filter(v => v.affected).length);
  }
});

test('All Varga results retain Rasi Nakshatra Pada and reasons', () => {
  for (const planet of out.planets) for (const v of planet.allVargas) {
    assert(v.rasiNo >= 1 && v.rasiNo <= 12);
    assert(v.nakshatraNo >= 1 && v.nakshatraNo <= 27);
    assert(v.pada >= 1 && v.pada <= 4);
    assert(Array.isArray(v.reasons));
  }
});

test('Badly Affected remains controlled only by frozen D1+D9+D60 rule', () => {
  for (const planet of out.planets) {
    assert.strictEqual(planet.badlyAffected, planet.d1.affected && planet.d9.affected && planet.d60.affected);
  }
});

test('Badly Affected still disables remedy', () => {
  for (const planet of out.planets.filter(p => p.badlyAffected)) {
    assert.strictEqual(planet.remedyAllowed, false);
    assert.strictEqual(planet.remedy, null);
  }
});

test('Longitude helper gives valid Nakshatra/Pada details', () => {
  const d = longitudeDetails(359.9, 'en');
  assert.strictEqual(d.rasiNo, 12);
  assert.strictEqual(d.nakshatraNo, 27);
  assert(d.pada >= 1 && d.pada <= 4);
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);
if (fail === 0) console.log('\nD1-D60 EXTENDED UAT: PASS');
else { console.log('\nD1-D60 EXTENDED UAT: FAIL'); process.exitCode = 1; }
