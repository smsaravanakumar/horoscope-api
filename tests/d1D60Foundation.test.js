const assert = require('assert');
const { buildD1D60Analysis, getD60Row, D60_ROWS } = require('../services/d1D60AnalysisService');

let pass = 0;
let fail = 0;
function test(name, fn) {
  try { fn(); console.log(`PASS: ${name}`); pass++; }
  catch (e) { console.log(`FAIL: ${name}`); console.log(`      ${e.message}`); fail++; }
}

function p(key, name, longitude, rasiNo, combust=false) {
  return { key, name, longitude, rasiNo, combust };
}

const lagna = { key:'lagna', name:'லக்னம்', longitude:0, rasiNo:1 };
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

test('D60 table has exactly 60 rows', () => assert.strictEqual(D60_ROWS.length,60));
test('0°00-0°30 maps to D60 division 1 Ghora', () => { const r=getD60Row(0.1); assert.strictEqual(r.division,1); assert.strictEqual(r.name,'Ghora'); });
test('29°30-30°00 maps to division 60 Chandrarekha', () => { const r=getD60Row(29.9); assert.strictEqual(r.division,60); assert.strictEqual(r.name,'Chandrarekha'); });
test('Only nine classical grahas evaluated; Mandi excluded', () => assert.strictEqual(out.planets.length,9));
test('Phase explicitly limits current implementation to D1 D9 D60', () => { assert.deepStrictEqual(out.evaluatedCharts,['D1','D9','D60']); assert.strictEqual(out.d2ToD59Status,'pending_locked_calculation_convention'); });
test('D1 debilitation is detected', () => assert(out.planets.find(x=>x.key==='sun').d1.reasons.some(r=>r.code==='debilitated')));
test('D1 houses 6/8/12 condition is supported', () => assert(out.afflictionConditions.includes('houses_6_8_12')));
test('Malefic conjunction/aspect conditions are enabled', () => { assert(out.afflictionConditions.includes('malefic_conjunction')); assert(out.afflictionConditions.includes('malefic_aspect')); });
test('Combustion is included for D1', () => assert(out.planets.find(x=>x.key==='mercury').d1.reasons.some(r=>r.code==='combust')));
test('D60 inauspicious nature marks D60 affected', () => assert.strictEqual(out.planets.find(x=>x.key==='sun').d60.affected,true));
test('Badly affected requires D1 + D9 + D60 together', () => { for (const x of out.planets) assert.strictEqual(x.badlyAffected, x.d1.affected && x.d9.affected && x.d60.affected); });
test('Badly affected planet has no remedy allowed', () => { for (const x of out.planets.filter(x=>x.badlyAffected)) { assert.strictEqual(x.remedyAllowed,false); assert.strictEqual(x.remedy,null); } });
test('Dasha affected status is returned', () => { assert.strictEqual(out.currentDashaStatus.evaluated,true); assert.strictEqual(out.currentDashaStatus.planetKey,'saturn'); });
test('Bhukti affected status is returned', () => { assert.strictEqual(out.currentBhuktiStatus.evaluated,true); assert.strictEqual(out.currentBhuktiStatus.planetKey,'mercury'); });
test('D60 source metadata retained', () => { assert.strictEqual(out.d60TableCount,60); assert.strictEqual(out.d60TableSource,'client_supplied_60_x_0_30_degree_table'); });

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);
if (fail === 0) console.log('\nD1-D60 FOUNDATION UAT: PASS');
else { console.log('\nD1-D60 FOUNDATION UAT: FAIL'); process.exitCode=1; }
