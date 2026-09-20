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
  return {
    key,
    rasiNo,
    longitude: (rasiNo - 1) * 30 + 10,
    ...extra,
  };
}

function basePlanets(overrides = {}) {
  const defaults = {
    sun: planet('sun', 1),
    moon: planet('moon', 2),
    mars: planet('mars', 3),
    mercury: planet('mercury', 4),
    jupiter: planet('jupiter', 5),
    venus: planet('venus', 6),
    saturn: planet('saturn', 7),
    rahu: planet('rahu', 8),
    ketu: planet('ketu', 2),
    mandi: planet('mandi', 9),
  };
  const merged = { ...defaults, ...overrides };
  return Object.values(merged).filter(Boolean);
}

function evaluate(ruleNo, {
  lagnaRasiNo = 1,
  planets = basePlanets(),
  aspects = [],
  gender = null,
  isDayBirth = null,
} = {}) {
  const output = buildClientYogaRules({
    lagna: { key: 'lagna', rasiNo: lagnaRasiNo },
    planets,
    aspects,
    language: 'ta',
    gender,
    isDayBirth,
  });
  const rule = output.ruleResults.find((x) => x.ruleNo === ruleNo);
  assert(rule, `Rule ${ruleNo} missing`);
  return { rule, output };
}

// 11 - Chandra Adhi Yoga
check('R11 positive: Jupiter/Venus/Mercury in 6/7/8 from Moon', () => {
  const planets = basePlanets({
    moon: planet('moon', 1),
    jupiter: planet('jupiter', 6),
    venus: planet('venus', 7),
    mercury: planet('mercury', 8),
  });
  assert.equal(evaluate(11, { planets }).rule.matched, true);
});
check('R11 negative: one benefic outside 6/7/8 from Moon', () => {
  const planets = basePlanets({
    moon: planet('moon', 1),
    jupiter: planet('jupiter', 5),
    venus: planet('venus', 7),
    mercury: planet('mercury', 8),
  });
  assert.equal(evaluate(11, { planets }).rule.matched, false);
});

// 12 - Malavya
check('R12 positive: Venus own sign in Lagna kendra', () => {
  const planets = basePlanets({ venus: planet('venus', 7) });
  assert.equal(evaluate(12, { lagnaRasiNo: 4, planets }).rule.matched, true);
});
check('R12 negative: Venus not own/exalted', () => {
  const planets = basePlanets({ venus: planet('venus', 6) });
  assert.equal(evaluate(12, { lagnaRasiNo: 4, planets }).rule.matched, false);
});

// 13 - Vasumati
check('R13 positive: Jupiter/Venus/alone Mercury in Upachaya from Lagna', () => {
  const planets = basePlanets({
    sun: planet('sun', 1), moon: planet('moon', 2), mars: planet('mars', 4), saturn: planet('saturn', 5),
    jupiter: planet('jupiter', 3), venus: planet('venus', 6), mercury: planet('mercury', 10),
  });
  assert.equal(evaluate(13, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R13 negative: Mercury not alone', () => {
  const planets = basePlanets({
    sun: planet('sun', 10), moon: planet('moon', 2), mars: planet('mars', 4), saturn: planet('saturn', 5),
    jupiter: planet('jupiter', 3), venus: planet('venus', 6), mercury: planet('mercury', 10),
  });
  assert.equal(evaluate(13, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 14 - Saraswati
check('R14 positive: Mercury/Jupiter/Venus placed correctly and Jupiter friendly', () => {
  const planets = basePlanets({ mercury: planet('mercury', 2), jupiter: planet('jupiter', 5), venus: planet('venus', 7) });
  assert.equal(evaluate(14, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R14 negative: Jupiter not own/exalted/friendly', () => {
  const planets = basePlanets({ mercury: planet('mercury', 4), jupiter: planet('jupiter', 2), venus: planet('venus', 7) });
  assert.equal(evaluate(14, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 15 - Durudhara
check('R15 positive: planets on both sides of Moon', () => {
  const planets = basePlanets({ moon: planet('moon', 4), mars: planet('mars', 5), venus: planet('venus', 3) });
  assert.equal(evaluate(15, { planets }).rule.matched, true);
});
check('R15 negative: only one side of Moon occupied', () => {
  const planets = basePlanets({ moon: planet('moon', 4), mars: planet('mars', 5), venus: planet('venus', 6), saturn: planet('saturn', 7), mercury: planet('mercury', 8), jupiter: planet('jupiter', 9) });
  assert.equal(evaluate(15, { planets }).rule.matched, false);
});

// 16 - Ubhayachari
check('R16 positive: eligible planets on both sides of Sun', () => {
  const planets = basePlanets({ sun: planet('sun', 5), mars: planet('mars', 6), saturn: planet('saturn', 4) });
  assert.equal(evaluate(16, { planets }).rule.matched, true);
});
check('R16 negative: only one side of Sun occupied', () => {
  const planets = basePlanets({ sun: planet('sun', 5), mars: planet('mars', 6), saturn: planet('saturn', 7), mercury: planet('mercury', 8), jupiter: planet('jupiter', 9), venus: planet('venus', 10) });
  assert.equal(evaluate(16, { planets }).rule.matched, false);
});

// 17 - Chamara
check('R17 positive: strong Lagna lord in kendra + Jupiter aspect to Lagna', () => {
  const planets = basePlanets({ mars: planet('mars', 1), jupiter: planet('jupiter', 9) });
  const aspects = [{ fromKey: 'jupiter', toRasi: 1 }];
  assert.equal(evaluate(17, { lagnaRasiNo: 1, planets, aspects }).rule.matched, true);
});
check('R17 negative: Lagna lord not strong/in kendra', () => {
  const planets = basePlanets({ mars: planet('mars', 2), jupiter: planet('jupiter', 9) });
  const aspects = [{ fromKey: 'jupiter', toRasi: 1 }];
  assert.equal(evaluate(17, { lagnaRasiNo: 1, planets, aspects }).rule.matched, false);
});

// 18 - Parvata
check('R18 positive: only benefics in kendras, 6th/8th empty', () => {
  const planets = basePlanets({
    sun: planet('sun', 2), moon: planet('moon', 3), mars: planet('mars', 5), saturn: planet('saturn', 9),
    jupiter: planet('jupiter', 1), venus: planet('venus', 4), mercury: planet('mercury', 7),
  });
  assert.equal(evaluate(18, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R18 positive alternate: Lagna lord and 12th lord mutual kendras', () => {
  const planets = basePlanets({ mars: planet('mars', 1), jupiter: planet('jupiter', 4) });
  assert.equal(evaluate(18, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R18 negative: malefic in kendra and alternate branch absent', () => {
  const planets = basePlanets({
    sun: planet('sun', 2), moon: planet('moon', 3), mars: planet('mars', 4), saturn: planet('saturn', 9),
    jupiter: planet('jupiter', 2), venus: planet('venus', 7), mercury: planet('mercury', 10),
  });
  assert.equal(evaluate(18, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 19 - Mahabhagya
check('R19 positive male: day birth + Lagna/Sun/Moon odd signs', () => {
  const planets = basePlanets({ sun: planet('sun', 3), moon: planet('moon', 5) });
  assert.equal(evaluate(19, { lagnaRasiNo: 1, planets, gender: 'male', isDayBirth: true }).rule.matched, true);
});
check('R19 positive female: night birth + Lagna/Sun/Moon even signs', () => {
  const planets = basePlanets({ sun: planet('sun', 4), moon: planet('moon', 6) });
  assert.equal(evaluate(19, { lagnaRasiNo: 2, planets, gender: 'female', isDayBirth: false }).rule.matched, true);
});
check('R19 negative male: same odd signs but night birth', () => {
  const planets = basePlanets({ sun: planet('sun', 3), moon: planet('moon', 5) });
  assert.equal(evaluate(19, { lagnaRasiNo: 1, planets, gender: 'male', isDayBirth: false }).rule.matched, false);
});

// 20 - Sasa
check('R20 positive: Saturn own sign in Lagna kendra', () => {
  const planets = basePlanets({ saturn: planet('saturn', 10) });
  assert.equal(evaluate(20, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R20 negative: Saturn own sign but not in kendra', () => {
  const planets = basePlanets({ saturn: planet('saturn', 11) });
  assert.equal(evaluate(20, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

check('Batch metadata: Rules 1-40 evaluated after extension', () => {
  const { output } = evaluate(20);
  assert.equal(output.totalPlannedRules, 40);
  assert.equal(output.implementedThroughRule, 40);
  assert.equal(output.evaluatedRuleCount, 40);
  assert.equal(output.pendingRuleCount, 0);
  assert.equal(output.ruleResults.length, 40);
});

check('Every Rule 11-20 retains formula/source/benefit', () => {
  const { output } = evaluate(20);
  for (const r of output.ruleResults.filter((x) => x.ruleNo >= 11 && x.ruleNo <= 20)) {
    assert(r.formulaTa && r.sourceTa && r.benefitTa, `Rule ${r.ruleNo} missing source metadata`);
  }
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);

if (fail > 0) {
  console.error('\nYOGA RULES 11-20 BASIC UAT: FAIL');
  process.exit(1);
}

console.log('\nYOGA RULES 11-20 BASIC UAT: PASS');
