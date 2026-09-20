const assert = require('assert');
const { buildClientYogaRules } = require('../services/clientYogaRuleService');

let pass = 0;
let fail = 0;

function check(label, fn) {
  try {
    fn();
    pass += 1;
    console.log(`PASS: ${label}`);
  } catch (err) {
    fail += 1;
    console.error(`FAIL: ${label}`);
    console.error(`      ${err.message}`);
  }
}

function planet(key, rasiNo, extra = {}) {
  return { key, rasiNo, longitude: (rasiNo - 1) * 30 + 10, ...extra };
}

function basePlanets(overrides = {}) {
  const defaults = {
    sun: planet('sun', 1), moon: planet('moon', 2), mars: planet('mars', 3),
    mercury: planet('mercury', 4), jupiter: planet('jupiter', 5), venus: planet('venus', 6),
    saturn: planet('saturn', 7), rahu: planet('rahu', 8), ketu: planet('ketu', 2), mandi: planet('mandi', 9),
  };
  return Object.values({ ...defaults, ...overrides }).filter(Boolean);
}

function evaluate(ruleNo, { lagnaRasiNo = 1, planets = basePlanets(), aspects = [] } = {}) {
  const output = buildClientYogaRules({
    lagna: { key: 'lagna', rasiNo: lagnaRasiNo },
    planets,
    aspects,
    language: 'ta',
  });
  const rule = output.ruleResults.find((x) => x.ruleNo === ruleNo);
  assert(rule, `Rule ${ruleNo} missing`);
  return { rule, output };
}

// 21 - Ruchaka
check('R21 positive: Mars own sign in Lagna kendra', () => {
  const planets = basePlanets({ mars: planet('mars', 1) });
  assert.equal(evaluate(21, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R21 negative: Mars own sign but not in Lagna kendra', () => {
  const planets = basePlanets({ mars: planet('mars', 8) });
  assert.equal(evaluate(21, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 22 - Bhadra
check('R22 positive: Mercury own sign in Lagna kendra', () => {
  const planets = basePlanets({ mercury: planet('mercury', 3) });
  assert.equal(evaluate(22, { lagnaRasiNo: 3, planets }).rule.matched, true);
});
check('R22 negative: Mercury own sign but not in Lagna kendra', () => {
  const planets = basePlanets({ mercury: planet('mercury', 3) });
  assert.equal(evaluate(22, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 23 - Kalanidhi
check('R23 positive branch 1: Jupiter in 2nd + Mercury and Venus relation', () => {
  const planets = basePlanets({ jupiter: planet('jupiter', 2), mercury: planet('mercury', 4), venus: planet('venus', 5) });
  const aspects = [{ fromKey: 'mercury', toRasi: 2 }, { fromKey: 'venus', toRasi: 2 }];
  assert.equal(evaluate(23, { lagnaRasiNo: 1, planets, aspects }).rule.matched, true);
});
check('R23 positive branch 2: Jupiter in Mercury sign + benefic aspect', () => {
  const planets = basePlanets({ jupiter: planet('jupiter', 3), venus: planet('venus', 6) });
  const aspects = [{ fromKey: 'venus', toRasi: 3 }];
  assert.equal(evaluate(23, { lagnaRasiNo: 1, planets, aspects }).rule.matched, true);
});
check('R23 negative: Jupiter in 9th but only Mercury relation', () => {
  const planets = basePlanets({ jupiter: planet('jupiter', 9), mercury: planet('mercury', 4), venus: planet('venus', 5) });
  const aspects = [{ fromKey: 'mercury', toRasi: 9 }];
  assert.equal(evaluate(23, { lagnaRasiNo: 1, planets, aspects }).rule.matched, false);
});

// 24 - Sunapha
check('R24 positive: eligible planet 2nd from Moon', () => {
  const planets = basePlanets({ moon: planet('moon', 4), mars: planet('mars', 5), mercury: planet('mercury', 7), jupiter: planet('jupiter', 8), venus: planet('venus', 9), saturn: planet('saturn', 10) });
  assert.equal(evaluate(24, { planets }).rule.matched, true);
});
check('R24 negative: no eligible planet 2nd from Moon', () => {
  const planets = basePlanets({ moon: planet('moon', 4), mars: planet('mars', 6), mercury: planet('mercury', 7), jupiter: planet('jupiter', 8), venus: planet('venus', 9), saturn: planet('saturn', 10) });
  assert.equal(evaluate(24, { planets }).rule.matched, false);
});

// 25 - Anapha
check('R25 positive: eligible planet 12th from Moon', () => {
  const planets = basePlanets({ moon: planet('moon', 4), mars: planet('mars', 3), mercury: planet('mercury', 6), jupiter: planet('jupiter', 7), venus: planet('venus', 8), saturn: planet('saturn', 9) });
  assert.equal(evaluate(25, { planets }).rule.matched, true);
});
check('R25 negative: no eligible planet 12th from Moon', () => {
  const planets = basePlanets({ moon: planet('moon', 4), mars: planet('mars', 5), mercury: planet('mercury', 6), jupiter: planet('jupiter', 7), venus: planet('venus', 8), saturn: planet('saturn', 9) });
  assert.equal(evaluate(25, { planets }).rule.matched, false);
});

// 26 - Vesi
check('R26 positive: eligible planet 2nd from Sun', () => {
  const planets = basePlanets({ sun: planet('sun', 5), mars: planet('mars', 6), mercury: planet('mercury', 8), jupiter: planet('jupiter', 9), venus: planet('venus', 10), saturn: planet('saturn', 11) });
  assert.equal(evaluate(26, { planets }).rule.matched, true);
});
check('R26 negative: no eligible planet 2nd from Sun', () => {
  const planets = basePlanets({ sun: planet('sun', 5), mars: planet('mars', 7), mercury: planet('mercury', 8), jupiter: planet('jupiter', 9), venus: planet('venus', 10), saturn: planet('saturn', 11) });
  assert.equal(evaluate(26, { planets }).rule.matched, false);
});

// 27 - Vasi
check('R27 positive: eligible planet 12th from Sun', () => {
  const planets = basePlanets({ sun: planet('sun', 5), mars: planet('mars', 4), mercury: planet('mercury', 7), jupiter: planet('jupiter', 8), venus: planet('venus', 9), saturn: planet('saturn', 10) });
  assert.equal(evaluate(27, { planets }).rule.matched, true);
});
check('R27 negative: no eligible planet 12th from Sun', () => {
  const planets = basePlanets({ sun: planet('sun', 5), mars: planet('mars', 6), mercury: planet('mercury', 7), jupiter: planet('jupiter', 8), venus: planet('venus', 9), saturn: planet('saturn', 10) });
  assert.equal(evaluate(27, { planets }).rule.matched, false);
});

// 28 - Shankha
check('R28 positive branch 1: strong Lagna lord + 5L/6L mutual kendra', () => {
  const planets = basePlanets({ mars: planet('mars', 1), sun: planet('sun', 2), mercury: planet('mercury', 5), jupiter: planet('jupiter', 5), saturn: planet('saturn', 8) });
  assert.equal(evaluate(28, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R28 positive branch 2: Lagna lord and 10L movable + 9L exalted', () => {
  const planets = basePlanets({ mars: planet('mars', 1), saturn: planet('saturn', 4), jupiter: planet('jupiter', 4) });
  assert.equal(evaluate(28, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R28 negative: Lagna lord weak and alternate branch absent', () => {
  const planets = basePlanets({ mars: planet('mars', 2), sun: planet('sun', 2), mercury: planet('mercury', 5), jupiter: planet('jupiter', 5), saturn: planet('saturn', 8) });
  assert.equal(evaluate(28, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 29 - Kahala
check('R29 positive: 4L/9L mutual kendra + strong Lagna lord', () => {
  const planets = basePlanets({ moon: planet('moon', 2), jupiter: planet('jupiter', 5), mars: planet('mars', 1) });
  assert.equal(evaluate(29, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R29 negative: 4L/9L mutual kendra but Lagna lord not strong', () => {
  const planets = basePlanets({ moon: planet('moon', 2), jupiter: planet('jupiter', 5), mars: planet('mars', 2) });
  assert.equal(evaluate(29, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 30 - Srinatha
check('R30 positive: exalted 7L in kendra + 9L/10L conjunction or opposition relation', () => {
  const planets = basePlanets({ saturn: planet('saturn', 7), jupiter: planet('jupiter', 7), mars: planet('mars', 1) });
  assert.equal(evaluate(30, { lagnaRasiNo: 4, planets }).rule.matched, true);
});
check('R30 negative: 10L lacks relation to exalted 7L', () => {
  const planets = basePlanets({ saturn: planet('saturn', 7), jupiter: planet('jupiter', 7), mars: planet('mars', 2) });
  assert.equal(evaluate(30, { lagnaRasiNo: 4, planets }).rule.matched, false);
});

check('Batch metadata: Rules 1-40 evaluated', () => {
  const { output } = evaluate(30);
  assert.equal(output.totalPlannedRules, 40);
  assert.equal(output.implementedThroughRule, 40);
  assert.equal(output.evaluatedRuleCount, 40);
  assert.equal(output.pendingRuleCount, 0);
  assert.equal(output.ruleResults.length, 40);
});

check('Every Rule 21-30 retains formula/source/benefit', () => {
  const { output } = evaluate(30);
  for (const r of output.ruleResults.filter((x) => x.ruleNo >= 21 && x.ruleNo <= 30)) {
    assert(r.formulaTa && r.sourceTa && r.benefitTa, `Rule ${r.ruleNo} missing source metadata`);
  }
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);

if (fail > 0) {
  console.error('\nYOGA RULES 21-30 BASIC UAT: FAIL');
  process.exit(1);
}

console.log('\nYOGA RULES 21-30 BASIC UAT: PASS');
