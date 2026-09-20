const assert = require('assert');
const {
  buildPanchaPakshiAnalysis,
  nakshatraNumberFromLongitude,
  birdForNakshatra,
  pakshaFromPlanets,
} = require('../services/panchaPakshiService');

let pass = 0;
let fail = 0;
function test(name, fn) {
  try { fn(); console.log(`PASS: ${name}`); pass += 1; }
  catch (e) { console.log(`FAIL: ${name}`); console.log(`      ${e.message}`); fail += 1; }
}

// Nakshatra boundary / numbering sanity.
test('Ashwini is Nakshatra 1', () => assert.strictEqual(nakshatraNumberFromLongitude(0), 1));
test('Revati is Nakshatra 27', () => assert.strictEqual(nakshatraNumberFromLongitude(359.9), 27));

// Exact client table coverage for all five groups and both Pakshas.
test('Group 1 waxing = Vulture', () => assert.strictEqual(birdForNakshatra(1, 'waxing'), 'vulture'));
test('Group 1 waning = Peacock', () => assert.strictEqual(birdForNakshatra(5, 'waning'), 'peacock'));
test('Group 2 waxing = Owl', () => assert.strictEqual(birdForNakshatra(6, 'waxing'), 'owl'));
test('Group 2 waning = Cock', () => assert.strictEqual(birdForNakshatra(11, 'waning'), 'cock'));
test('Group 3 waxing = Crow', () => assert.strictEqual(birdForNakshatra(12, 'waxing'), 'crow'));
test('Group 3 waning = Crow', () => assert.strictEqual(birdForNakshatra(16, 'waning'), 'crow'));
test('Group 4 waxing = Cock', () => assert.strictEqual(birdForNakshatra(17, 'waxing'), 'cock'));
test('Group 4 waning = Owl', () => assert.strictEqual(birdForNakshatra(21, 'waning'), 'owl'));
test('Group 5 waxing = Peacock', () => assert.strictEqual(birdForNakshatra(22, 'waxing'), 'peacock'));
test('Group 5 waning = Vulture', () => assert.strictEqual(birdForNakshatra(27, 'waning'), 'vulture'));

const waxingPlanets = [
  { key: 'sun', longitude: 0 },
  { key: 'moon', longitude: 60 },
];
const waningPlanets = [
  { key: 'sun', longitude: 0 },
  { key: 'moon', longitude: 240 },
];

test('Paksha detects waxing', () => assert.strictEqual(pakshaFromPlanets(waxingPlanets), 'waxing'));
test('Paksha detects waning', () => assert.strictEqual(pakshaFromPlanets(waningPlanets), 'waning'));

test('Tamil output returns all 3 requested birds', () => {
  const result = buildPanchaPakshiAnalysis({
    lagna: { longitude: 150 },
    planets: waxingPlanets,
    fortunePoint: { longitude: 300 },
    language: 'ta',
  });
  assert.strictEqual(result.evaluated, true);
  assert.strictEqual(result.paksha.name, 'வளர்பிறை');
  assert.ok(result.fortuneNakshatraBird.bird);
  assert.ok(result.janmaNakshatraBird.bird);
  assert.ok(result.lagnaNakshatraBird.bird);
});

test('English output is localized', () => {
  const result = buildPanchaPakshiAnalysis({
    lagna: { longitude: 150 },
    planets: waningPlanets,
    fortunePoint: { longitude: 300 },
    language: 'en',
  });
  assert.strictEqual(result.paksha.name, 'Waning Moon');
  assert.ok(['Vulture','Owl','Crow','Cock','Peacock'].includes(result.fortuneNakshatraBird.bird));
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);
console.log(fail === 0 ? '\nPANCHA PAKSHI BASIC UAT: PASS' : '\nPANCHA PAKSHI BASIC UAT: FAIL');
process.exitCode = fail === 0 ? 0 : 1;
