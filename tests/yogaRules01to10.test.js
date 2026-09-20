const assert = require('assert');
const { buildClientYogaRules } = require('../services/clientYogaRuleService');

function p(key, rasiNo, extra = {}) {
  return {
    key,
    rasiNo,
    longitude: ((rasiNo - 1) * 30) + (extra.degreeInRasi ?? 10),
    degreeInRasi: extra.degreeInRasi ?? 10,
    retrograde: false,
    combust: false,
    ...extra,
  };
}

function basePlanets(overrides = {}) {
  const defaults = {
    sun: p('sun', 5), moon: p('moon', 2), mars: p('mars', 1), mercury: p('mercury', 3),
    jupiter: p('jupiter', 9), venus: p('venus', 2), saturn: p('saturn', 11),
    rahu: p('rahu', 6), ketu: p('ketu', 12), mandi: p('mandi', 4),
  };
  return Object.values({ ...defaults, ...overrides });
}

function lagna(rasiNo = 1) { return { rasiNo }; }

function evalRules({ l = 1, planets = basePlanets(), aspects = [] } = {}) {
  return buildClientYogaRules({ lagna: lagna(l), planets, aspects, language: 'ta' }).ruleResults;
}

let pass = 0;
let fail = 0;
function test(name, fn) {
  try { fn(); pass++; console.log(`PASS: ${name}`); }
  catch (e) { fail++; console.error(`FAIL: ${name}`); console.error(e.message); }
}
function rule(results, n) { return results.find((x) => x.ruleNo === n); }

// 1 Gaja Kesari
test('R1 positive: Jupiter 4th from Moon', () => {
  const r = evalRules({ planets: basePlanets({ moon: p('moon', 1), jupiter: p('jupiter', 4) }) });
  assert.equal(rule(r, 1).matched, true);
});
test('R1 negative: Jupiter 2nd from Moon', () => {
  const r = evalRules({ planets: basePlanets({ moon: p('moon', 1), jupiter: p('jupiter', 2) }) });
  assert.equal(rule(r, 1).matched, false);
});

// 2 Dharma-Karmadhipati (Aries lagna: 9L Jupiter, 10L Saturn)
test('R2 positive: 9L and 10L conjunction', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ jupiter: p('jupiter', 4), saturn: p('saturn', 4) }) });
  assert.equal(rule(r, 2).matched, true);
});
test('R2 positive: 9L and 10L opposition', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ jupiter: p('jupiter', 1), saturn: p('saturn', 7) }) });
  assert.equal(rule(r, 2).matched, true);
});
test('R2 negative: no conjunction/opposition/exchange', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ jupiter: p('jupiter', 2), saturn: p('saturn', 4) }) });
  assert.equal(rule(r, 2).matched, false);
});

// 3 Neecha Bhanga Raja Yoga
test('R3 positive: debilitated Jupiter in Capricorn, dispositor Saturn kendra from Lagna', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ jupiter: p('jupiter', 10), saturn: p('saturn', 4), moon: p('moon', 2) }) });
  assert.equal(rule(r, 3).matched, true);
});
test('R3 negative: debilitated Jupiter, cancellation planets not kendra from Lagna/Moon', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ jupiter: p('jupiter', 10), saturn: p('saturn', 2), mars: p('mars', 5), moon: p('moon', 6) }) });
  assert.equal(rule(r, 3).matched, false);
});

// 4 Vipareeta Raja Yoga. Aries lagna: 6L Mercury (Virgo), 8L Mars (Scorpio), 12L Jupiter (Pisces)
test('R4 positive: dusthana lords exchange', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ mercury: p('mercury', 8), mars: p('mars', 6) }) });
  assert.equal(rule(r, 4).matched, true);
});
test('R4 positive: two dusthana lords conjunct in dusthana without benefic aspect', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ mercury: p('mercury', 6), mars: p('mars', 6) }), aspects: [] });
  assert.equal(rule(r, 4).matched, true);
});

// 5 Hamsa
test('R5 positive: Jupiter own sign in Lagna kendra', () => {
  const r = evalRules({ l: 9, planets: basePlanets({ jupiter: p('jupiter', 9) }) });
  assert.equal(rule(r, 5).matched, true);
});
test('R5 negative: Jupiter own sign but non-kendra', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ jupiter: p('jupiter', 9) }) });
  assert.equal(rule(r, 5).matched, false);
});

// 6 Chandra Mangala
test('R6 positive: Moon Mars conjunction', () => {
  const r = evalRules({ planets: basePlanets({ moon: p('moon', 2), mars: p('mars', 2) }) });
  assert.equal(rule(r, 6).matched, true);
});
test('R6 positive: Moon Mars mutual 7th', () => {
  const r = evalRules({ planets: basePlanets({ moon: p('moon', 2), mars: p('mars', 8) }) });
  assert.equal(rule(r, 6).matched, true);
});

// 7 Budha Aditya
test('R7 positive: Sun Mercury same Rasi even when Mercury combust flag true', () => {
  const r = evalRules({ planets: basePlanets({ sun: p('sun', 5), mercury: p('mercury', 5, { combust: true }) }) });
  assert.equal(rule(r, 7).matched, true);
});
test('R7 negative: Sun Mercury different Rasi', () => {
  const r = evalRules({ planets: basePlanets({ sun: p('sun', 5), mercury: p('mercury', 6) }) });
  assert.equal(rule(r, 7).matched, false);
});

// 8 Amala
test('R8 positive: Jupiter alone 10th from Lagna', () => {
  const planets = basePlanets({ jupiter: p('jupiter', 10), saturn: p('saturn', 11) });
  const r = evalRules({ l: 1, planets });
  assert.equal(rule(r, 8).matched, true);
});
test('R8 negative: Jupiter 10th but not alone', () => {
  const planets = basePlanets({ jupiter: p('jupiter', 10), saturn: p('saturn', 10) });
  const r = evalRules({ l: 1, planets });
  assert.equal(rule(r, 8).matched, false);
});

// 9 Lakshmi. Aries lagna 9L Jupiter. Jupiter own in 9th; Venus own in Taurus 2nd is not kendra => negative.
test('R9 positive: strong 9L in trine and Venus own/exalted in kendra', () => {
  const r = evalRules({ l: 4, planets: basePlanets({ jupiter: p('jupiter', 12), venus: p('venus', 7) }) });
  // Cancer lagna: 9L Jupiter in Pisces = 9th/own; Venus in Libra = 4th/own.
  assert.equal(rule(r, 9).matched, true);
});
test('R9 negative: Venus own/exalted but not kendra', () => {
  const r = evalRules({ l: 1, planets: basePlanets({ jupiter: p('jupiter', 9), venus: p('venus', 2) }) });
  assert.equal(rule(r, 9).matched, false);
});

// 10 Guru Mangala
test('R10 positive: Jupiter Mars conjunction', () => {
  const r = evalRules({ planets: basePlanets({ jupiter: p('jupiter', 9), mars: p('mars', 9) }) });
  assert.equal(rule(r, 10).matched, true);
});
test('R10 positive: Mars 5th from Jupiter', () => {
  const r = evalRules({ planets: basePlanets({ jupiter: p('jupiter', 1), mars: p('mars', 5) }) });
  assert.equal(rule(r, 10).matched, true);
});
test('R10 negative: no conjunction/trinal relation', () => {
  const r = evalRules({ planets: basePlanets({ jupiter: p('jupiter', 1), mars: p('mars', 3) }) });
  assert.equal(rule(r, 10).matched, false);
});

// Metadata / isolation checks
test('Batch metadata after Rules 31-40 extension', () => {
  const out = buildClientYogaRules({ lagna: lagna(1), planets: basePlanets(), aspects: [] });
  assert.equal(out.totalPlannedRules, 40);
  assert.equal(out.implementedThroughRule, 40);
  assert.equal(out.evaluatedRuleCount, 40);
  assert.equal(out.pendingRuleCount, 0);
  assert.deepEqual(out.ruleResults.map((x) => x.ruleNo), [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]);
});
test('Every Rule 1-10 retains formula/source/benefit', () => {
  const out = buildClientYogaRules({ lagna: lagna(1), planets: basePlanets(), aspects: [] });
  for (const x of out.ruleResults) {
    assert.ok(x.formulaTa);
    assert.ok(x.sourceTa);
    assert.ok(x.benefitTa);
  }
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);
if (fail === 0) {
  console.log('\nYOGA RULES 1-10 BASIC UAT: PASS');
  process.exit(0);
}
console.log('\nYOGA RULES 1-10 BASIC UAT: FAIL');
process.exit(1);
