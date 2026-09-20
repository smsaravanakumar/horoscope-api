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
    sun: planet('sun', 1), moon: planet('moon', 7), mars: planet('mars', 3),
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

// 31 - Maha/Subha Parivarthana
check('R31 positive: 1L and 2L exchange', () => {
  const planets = basePlanets({ mars: planet('mars', 2), venus: planet('venus', 1) });
  assert.equal(evaluate(31, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R31 positive: 5L and 9L exchange', () => {
  const planets = basePlanets({ sun: planet('sun', 9), jupiter: planet('jupiter', 5) });
  assert.equal(evaluate(31, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R31 negative: no eligible lord exchange', () => {
  const planets = basePlanets({ mars: planet('mars', 1), venus: planet('venus', 2), sun: planet('sun', 5), jupiter: planet('jupiter', 9) });
  assert.equal(evaluate(31, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 32 - Subha Kartari
check('R32 positive: benefics on 2nd and 12th sides of Lagna', () => {
  const planets = basePlanets({
    sun: planet('sun', 6), moon: planet('moon', 12), mercury: planet('mercury', 6),
    jupiter: planet('jupiter', 2), venus: planet('venus', 12),
  });
  assert.equal(evaluate(32, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R32 negative: no reference hemmed by qualifying benefics', () => {
  const planets = basePlanets({
    sun: planet('sun', 1), moon: planet('moon', 7), mercury: planet('mercury', 1),
    jupiter: planet('jupiter', 2), venus: planet('venus', 2),
  });
  assert.equal(evaluate(32, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 33 - Gauri
check('R33 positive: Moon lord strong in kendra/trine + Jupiter aspect to Moon', () => {
  const planets = basePlanets({ moon: planet('moon', 4), jupiter: planet('jupiter', 9) });
  const aspects = [{ fromKey: 'jupiter', toRasi: 4 }];
  assert.equal(evaluate(33, { lagnaRasiNo: 1, planets, aspects }).rule.matched, true);
});
check('R33 negative: Jupiter does not aspect Moon', () => {
  const planets = basePlanets({ moon: planet('moon', 4), jupiter: planet('jupiter', 9) });
  assert.equal(evaluate(33, { lagnaRasiNo: 1, planets, aspects: [] }).rule.matched, false);
});

// 34 - Pushkala
check('R34 positive: Lagna lord conjunct Moon + Moon lord kendra/trine + benefic aspect Lagna', () => {
  const planets = basePlanets({ mars: planet('mars', 1), moon: planet('moon', 1), jupiter: planet('jupiter', 9) });
  const aspects = [{ fromKey: 'jupiter', toRasi: 1 }];
  assert.equal(evaluate(34, { lagnaRasiNo: 1, planets, aspects }).rule.matched, true);
});
check('R34 negative: no benefic aspect to Lagna', () => {
  const planets = basePlanets({ mars: planet('mars', 1), moon: planet('moon', 1), jupiter: planet('jupiter', 9) });
  assert.equal(evaluate(34, { lagnaRasiNo: 1, planets, aspects: [] }).rule.matched, false);
});

// 35 - Bheri
check('R35 positive: Lagna lord/Jupiter/Venus in kendras + strong 9L', () => {
  const planets = basePlanets({ mars: planet('mars', 1), jupiter: planet('jupiter', 4), venus: planet('venus', 7) });
  assert.equal(evaluate(35, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R35 negative: Venus outside kendra', () => {
  const planets = basePlanets({ mars: planet('mars', 1), jupiter: planet('jupiter', 4), venus: planet('venus', 3) });
  assert.equal(evaluate(35, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 36 - Brahma
check('R36 positive: Jupiter kendra from 9L, Venus kendra from 11L, Mercury kendra from Lagna', () => {
  const planets = basePlanets({ jupiter: planet('jupiter', 9), saturn: planet('saturn', 1), venus: planet('venus', 4), mercury: planet('mercury', 1) });
  assert.equal(evaluate(36, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R36 positive alternate: Mercury kendra from 10L', () => {
  const planets = basePlanets({ jupiter: planet('jupiter', 9), saturn: planet('saturn', 2), venus: planet('venus', 5), mercury: planet('mercury', 5) });
  assert.equal(evaluate(36, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R36 negative: Venus not kendra from 11L', () => {
  const planets = basePlanets({ jupiter: planet('jupiter', 9), saturn: planet('saturn', 1), venus: planet('venus', 2), mercury: planet('mercury', 1) });
  assert.equal(evaluate(36, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 37 - Shiva
check('R37 positive: exact 5L->9H, 9L->10H, 10L->5H placement', () => {
  const planets = basePlanets({ sun: planet('sun', 9), jupiter: planet('jupiter', 10), saturn: planet('saturn', 5) });
  assert.equal(evaluate(37, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R37 positive relation branch: all three lords connected', () => {
  const planets = basePlanets({ sun: planet('sun', 2), jupiter: planet('jupiter', 2), saturn: planet('saturn', 8) });
  const aspects = [{ fromKey: 'jupiter', toRasi: 8 }];
  assert.equal(evaluate(37, { lagnaRasiNo: 1, planets, aspects }).rule.matched, true);
});
check('R37 negative: neither placement nor connected relation', () => {
  const planets = basePlanets({ sun: planet('sun', 2), jupiter: planet('jupiter', 4), saturn: planet('saturn', 6) });
  assert.equal(evaluate(37, { lagnaRasiNo: 1, planets, aspects: [] }).rule.matched, false);
});

// 38 - Kurma
check('R38 positive: strong benefic in 5/6/7 + strong malefic in 1/3/11', () => {
  const planets = basePlanets({ sun: planet('sun', 1), mercury: planet('mercury', 6), jupiter: planet('jupiter', 9), venus: planet('venus', 2), moon: planet('moon', 8) });
  assert.equal(evaluate(38, { lagnaRasiNo: 1, planets }).rule.matched, true);
});
check('R38 negative: qualifying benefic side but no strong malefic in 1/3/11', () => {
  const planets = basePlanets({ sun: planet('sun', 2), mars: planet('mars', 4), saturn: planet('saturn', 7), mercury: planet('mercury', 6), jupiter: planet('jupiter', 9), venus: planet('venus', 2), moon: planet('moon', 8) });
  assert.equal(evaluate(38, { lagnaRasiNo: 1, planets }).rule.matched, false);
});

// 39 - Bhaskara
check('R39 positive: Sun 2nd from Mercury + Moon 11th from Sun + Jupiter 5th from Moon', () => {
  const planets = basePlanets({ mercury: planet('mercury', 1), sun: planet('sun', 2), moon: planet('moon', 12), jupiter: planet('jupiter', 4) });
  assert.equal(evaluate(39, { planets }).rule.matched, true);
});
check('R39 negative: Jupiter not 5th/9th from Moon', () => {
  const planets = basePlanets({ mercury: planet('mercury', 1), sun: planet('sun', 2), moon: planet('moon', 12), jupiter: planet('jupiter', 5) });
  assert.equal(evaluate(39, { planets }).rule.matched, false);
});

// 40 - Veena/Vallaki
check('R40 positive: seven classical planets in seven distinct Rasis', () => {
  const planets = [
    planet('sun', 1), planet('moon', 2), planet('mars', 3), planet('mercury', 4),
    planet('jupiter', 5), planet('venus', 6), planet('saturn', 7),
    planet('rahu', 8), planet('ketu', 2), planet('mandi', 9),
  ];
  assert.equal(evaluate(40, { planets }).rule.matched, true);
});
check('R40 negative: two classical planets share a Rasi', () => {
  const planets = [
    planet('sun', 1), planet('moon', 1), planet('mars', 3), planet('mercury', 4),
    planet('jupiter', 5), planet('venus', 6), planet('saturn', 7),
    planet('rahu', 8), planet('ketu', 2), planet('mandi', 9),
  ];
  assert.equal(evaluate(40, { planets }).rule.matched, false);
});

check('Batch metadata: all Rules 1-40 evaluated', () => {
  const { output } = evaluate(40);
  assert.equal(output.totalPlannedRules, 40);
  assert.equal(output.implementedThroughRule, 40);
  assert.equal(output.evaluatedRuleCount, 40);
  assert.equal(output.pendingRuleCount, 0);
  assert.equal(output.ruleResults.length, 40);
});

check('Every Rule 31-40 retains formula/source/benefit', () => {
  const { output } = evaluate(40);
  for (const r of output.ruleResults.filter((x) => x.ruleNo >= 31 && x.ruleNo <= 40)) {
    assert(r.formulaTa && r.sourceTa && r.benefitTa, `Rule ${r.ruleNo} missing source metadata`);
  }
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);

if (fail > 0) {
  console.error('\nYOGA RULES 31-40 BASIC UAT: FAIL');
  process.exit(1);
}

console.log('\nYOGA RULES 31-40 BASIC UAT: PASS');
