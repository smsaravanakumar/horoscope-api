const assert = require('assert');

const {
  buildMoleScarAnalysis,
  getAutomaticRuleCoverage,
  getHouseNumberFromRasi,
  buildAspectHouseTargets,
  getNavamsaRasiNumber,
} = require('../services/moleScarAnalysisService');

let pass = 0;
let fail = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    pass += 1;
  } catch (error) {
    console.log(`FAIL: ${name}`);
    console.log(`      ${error.message}`);
    fail += 1;
  }
}

function longitudeForRasi(rasiNo, degree = 5) {
  return (rasiNo - 1) * 30 + degree;
}

function planet(key, rasiNo, degree = 5) {
  return {
    key,
    longitude: longitudeForRasi(rasiNo, degree),
    rasiNo,
  };
}

function lagna(rasiNo = 1, degree = 1) {
  return {
    key: 'lagna',
    longitude: longitudeForRasi(rasiNo, degree),
    rasiNo,
  };
}

function allPlanets(overrides = {}) {
  const defaults = {
    sun: [2, 5],
    moon: [3, 5],
    mars: [4, 5],
    mercury: [5, 5],
    jupiter: [6, 5],
    venus: [7, 5],
    saturn: [8, 5],
    rahu: [9, 5],
    ketu: [3, 5],
  };

  return Object.entries({ ...defaults, ...overrides }).map(
    ([key, [rasiNo, degree]]) => planet(key, rasiNo, degree)
  );
}

function matchedRule(analysis, ruleNo) {
  return analysis.matchedRules.find((rule) => rule.ruleNo === ruleNo) || null;
}

test('All 73 automatic client rules are supported by Step 2 evaluator', () => {
  const coverage = getAutomaticRuleCoverage();
  assert.strictEqual(coverage.automaticRuleCount, 73);
  assert.strictEqual(coverage.supportedRuleCount, 73);
  assert.deepStrictEqual(coverage.unsupported, []);
});

test('House calculation is relative to Lagna', () => {
  assert.strictEqual(
    getHouseNumberFromRasi({ lagnaRasiNo: 1, rasiNo: 1 }),
    1
  );
  assert.strictEqual(
    getHouseNumberFromRasi({ lagnaRasiNo: 12, rasiNo: 1 }),
    2
  );
  assert.strictEqual(
    getHouseNumberFromRasi({ lagnaRasiNo: 5, rasiNo: 4 }),
    12
  );
});

test('Rule 1001 matches Rahu in Lagna and Rule 1004 matches Mars in 2nd house', () => {
  const analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      rahu: [1, 4],
      ketu: [7, 4],
      mars: [2, 8],
    }),
  });

  const r1001 = matchedRule(analysis, 1001);
  const r1004 = matchedRule(analysis, 1004);

  assert.ok(r1001);
  assert.strictEqual(r1001.evidence.requiredHouse, 1);
  assert.strictEqual(r1001.evidence.planetKey, 'rahu');

  assert.ok(r1004);
  assert.strictEqual(r1004.evidence.requiredHouse, 2);
  assert.strictEqual(r1004.evidence.planetKey, 'mars');
});

test('Slash client condition is treated as OR for Rule 1011', () => {
  const analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      rahu: [9, 4],
      ketu: [3, 4],
      saturn: [4, 4],
    }),
  });

  const rule = matchedRule(analysis, 1011);
  assert.ok(rule);
  assert.strictEqual(rule.evidence.type, 'house_any_of');
  assert.deepStrictEqual(rule.evidence.matchedPlanetKeys, ['saturn']);
});

test('Plus client condition requires both planets in same house for Rule 1051', () => {
  const matched = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      mars: [1, 6],
      rahu: [1, 12],
      ketu: [7, 12],
    }),
  });

  assert.ok(matchedRule(matched, 1051));

  const notMatched = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      mars: [1, 6],
      rahu: [2, 12],
      ketu: [8, 12],
    }),
  });

  assert.strictEqual(matchedRule(notMatched, 1051), null);
});

test('Rule 1067 requires Rahu in 6th plus Ketu aspect to 6th', () => {
  // Aries Lagna: house 6 = Virgo (rasi 6), house 12 = Pisces (rasi 12).
  // Ketu in house 12 casts its existing-engine 7th aspect to house 6.
  const analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      rahu: [6, 7],
      ketu: [12, 7],
    }),
  });

  const rule = matchedRule(analysis, 1067);
  assert.ok(rule);
  assert.strictEqual(rule.evidence.type, 'resident_plus_aspect');
  assert.strictEqual(rule.evidence.residentActualHouse, 6);
  assert.ok(rule.evidence.aspectTargetHouses.includes(6));
});

test('House-lord rules use Lagna sign lordships', () => {
  // Aries Lagna: Lagna lord = Mars. Place Mars in house 8 -> Rule 1087.
  let analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      mars: [8, 5],
    }),
  });

  let rule = matchedRule(analysis, 1087);
  assert.ok(rule);
  assert.strictEqual(rule.evidence.lordOfHouse, 1);
  assert.strictEqual(rule.evidence.lordPlanetKey, 'mars');
  assert.strictEqual(rule.evidence.actualHouse, 8);

  // Aries Lagna: 6th sign Virgo -> lord Mercury. Put Mercury in house 3 -> Rule 1090.
  analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      mercury: [3, 5],
    }),
  });

  rule = matchedRule(analysis, 1090);
  assert.ok(rule);
  assert.strictEqual(rule.evidence.lordOfHouse, 6);
  assert.strictEqual(rule.evidence.lordPlanetKey, 'mercury');
  assert.strictEqual(rule.evidence.actualHouse, 3);
});

test('Planet aspect rules return the exact houses as evidence', () => {
  assert.deepStrictEqual(buildAspectHouseTargets('jupiter', 1), [5, 7, 9]);
  assert.deepStrictEqual(buildAspectHouseTargets('saturn', 1), [3, 7, 10]);
  assert.deepStrictEqual(buildAspectHouseTargets('mars', 1), [4, 7, 8]);

  const analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      jupiter: [1, 5],
      saturn: [1, 12],
      mars: [1, 18],
    }),
  });

  assert.deepStrictEqual(matchedRule(analysis, 1091).evidence.targetHouses, [5, 7, 9]);
  assert.deepStrictEqual(matchedRule(analysis, 1092).evidence.targetHouses, [3, 7, 10]);
  assert.deepStrictEqual(matchedRule(analysis, 1093).evidence.targetHouses, [4, 7, 8]);
});

test('Navamsa Rules 1094 and 1095 return Rahu/Ketu Navamsa signs', () => {
  const rahuLongitude = longitudeForRasi(2, 5);
  const ketuLongitude = longitudeForRasi(8, 5);

  const analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets({
      rahu: [2, 5],
      ketu: [8, 5],
    }),
  });

  const r1094 = matchedRule(analysis, 1094);
  const r1095 = matchedRule(analysis, 1095);

  assert.ok(r1094);
  assert.ok(r1095);
  assert.strictEqual(
    r1094.evidence.navamsaRasiNo,
    getNavamsaRasiNumber(rahuLongitude)
  );
  assert.strictEqual(
    r1095.evidence.navamsaRasiNo,
    getNavamsaRasiNumber(ketuLongitude)
  );
});

test('Observation-dependent Rules 1096-1099 are never auto-matched', () => {
  const analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets(),
    gender: 'male',
  });

  assert.deepStrictEqual(
    analysis.observationDependentRules.map((rule) => rule.ruleNo),
    [1096, 1097, 1098, 1099]
  );

  for (const ruleNo of [1096, 1097, 1098, 1099]) {
    assert.strictEqual(matchedRule(analysis, ruleNo), null);
  }
});

test('Rule 1100 remains reference-only and missing 1029-1050 remain absent', () => {
  const analysis = buildMoleScarAnalysis({
    lagna: lagna(1),
    planets: allPlanets(),
  });

  assert.deepStrictEqual(
    analysis.referenceRules.map((rule) => rule.ruleNo),
    [1100]
  );
  assert.deepStrictEqual(
    analysis.missingRuleNos,
    Array.from({ length: 22 }, (_, index) => 1029 + index)
  );

  for (let ruleNo = 1029; ruleNo <= 1050; ruleNo += 1) {
    assert.strictEqual(matchedRule(analysis, ruleNo), null);
  }
});

test('Step 2 analysis is independent and does not mutate input chart objects', () => {
  const input = {
    lagna: lagna(1),
    planets: allPlanets({
      rahu: [1, 6],
      ketu: [7, 6],
    }),
  };

  const before = JSON.stringify(input);
  const analysis = buildMoleScarAnalysis(input);
  const after = JSON.stringify(input);

  assert.strictEqual(after, before);
  assert.strictEqual(analysis.evaluated, true);
  assert.strictEqual(analysis.summary.automaticRules, 73);
  assert.strictEqual(analysis.summary.observationDependentRules, 4);
  assert.strictEqual(analysis.summary.referenceRules, 1);
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);
console.log(
  fail === 0
    ? '\nMOLE/SCAR CALCULATION ENGINE UAT: PASS'
    : '\nMOLE/SCAR CALCULATION ENGINE UAT: FAIL'
);
process.exitCode = fail === 0 ? 0 : 1;
