const { buildNadiRuleAnalysis } = require("../services/nadiRuleService");

function planet(key, longitude, rasiNo, retrograde = false) {
  return { key, longitude, rasiNo, retrograde };
}

function lagna(rasiNo) {
  return { key: "lagna", rasiNo };
}

function getRule(result, ruleNo) {
  return result.ruleResults.find((r) => r.ruleNo === ruleNo);
}

function runCase(title, input, expectedRuleNo, expectedMatched, extraCheck = null) {
  const result = buildNadiRuleAnalysis(input);
  const rule = getRule(result, expectedRuleNo);

  let passed = Boolean(rule) && rule.matched === expectedMatched;
  if (passed && typeof extraCheck === "function") {
    passed = Boolean(extraCheck(rule));
  }

  console.log(`${title}: ${passed ? "PASS" : "FAIL"}`);

  if (!passed) {
    console.log("  Expected matched:", expectedMatched);
    console.log("  Actual matched  :", rule ? rule.matched : "Rule not found");
    console.log("  Details         :", rule ? JSON.stringify(rule.details, null, 2) : null);
  }

  return passed;
}

let passCount = 0;
let failCount = 0;

function test(title, input, ruleNo, expected, extraCheck = null) {
  const ok = runCase(title, input, ruleNo, expected, extraCheck);
  if (ok) passCount++;
  else failCount++;
}

console.log("");
console.log("==============================================");
console.log("NADI RULES 11-20 UAT");
console.log("==============================================");
console.log("");

// RULE 11
// Benefics Venus/Mercury/Moon in 5th or 9th from Jupiter.

test(
  "Rule 11 Positive - Venus 5th from Jupiter",
  {
    lagna: lagna(1),
    planets: [planet("jupiter", 5, 1), planet("venus", 125, 5)],
  },
  11,
  true
);

test(
  "Rule 11 Positive - Mercury 9th from Jupiter",
  {
    lagna: lagna(1),
    planets: [planet("jupiter", 5, 1), planet("mercury", 245, 9)],
  },
  11,
  true
);

test(
  "Rule 11 Negative - No defined benefic in 5th/9th from Jupiter",
  {
    lagna: lagna(1),
    planets: [planet("jupiter", 5, 1), planet("venus", 95, 4), planet("mercury", 185, 7), planet("moon", 305, 11)],
  },
  11,
  false
);

// RULE 12
// Lagna lord in 12th + Ketu 7th aspect.
// Aries Lagna -> Lagna lord Mars; 12th = Pisces (12); Ketu in Virgo (6) aspects Pisces by 7th.

test(
  "Rule 12 Positive - Lagna lord in 12th with Ketu aspect",
  {
    lagna: lagna(1),
    planets: [planet("mars", 350, 12), planet("ketu", 170, 6)],
  },
  12,
  true
);

test(
  "Rule 12 Negative - Lagna lord in 12th without Ketu aspect",
  {
    lagna: lagna(1),
    planets: [planet("mars", 350, 12), planet("ketu", 100, 4)],
  },
  12,
  false
);

// RULE 13
// Exchange between one of 6/8/12 lords and one of 1/5/9 lords.
// Aries Lagna: 6th lord Mercury (Virgo), 1st lord Mars (Aries).
// Put Mercury in Aries and Mars in Virgo -> exchange 6 <-> 1.

test(
  "Rule 13 Positive - 6th lord and 1st lord exchange",
  {
    lagna: lagna(1),
    planets: [planet("mercury", 10, 1), planet("mars", 160, 6)],
  },
  13,
  true,
  (rule) => Array.isArray(rule.details.exchanges) && rule.details.exchanges.length > 0
);

test(
  "Rule 13 Negative - No qualifying exchange",
  {
    lagna: lagna(1),
    planets: [planet("mercury", 160, 6), planet("mars", 10, 1)],
  },
  13,
  false
);

// RULE 14
// Same Rasi as Rahu; planet degree within sign <= Rahu degree.

test(
  "Rule 14 Positive - Saturn approaches Rahu in same Rasi",
  {
    lagna: lagna(1),
    planets: [planet("rahu", 78, 3), planet("saturn", 72, 3)],
  },
  14,
  true,
  (rule) => rule.details.matchedPlanets.some((p) => p.key === "saturn")
);

test(
  "Rule 14 Negative - Same Rasi but planet degree is greater than Rahu",
  {
    lagna: lagna(1),
    planets: [planet("rahu", 72, 3), planet("saturn", 78, 3)],
  },
  14,
  false
);

test(
  "Rule 14 Negative - Lower degree but different Rasi",
  {
    lagna: lagna(1),
    planets: [planet("rahu", 78, 3), planet("saturn", 92, 4)],
  },
  14,
  false
);

// RULE 15
// Same Rasi as Ketu; planet degree within sign >= Ketu degree.

test(
  "Rule 15 Positive - Jupiter separates from Ketu in same Rasi",
  {
    lagna: lagna(1),
    planets: [planet("ketu", 186, 7), planet("jupiter", 192, 7)],
  },
  15,
  true,
  (rule) => rule.details.matchedPlanets.some((p) => p.key === "jupiter")
);

test(
  "Rule 15 Negative - Same Rasi but planet degree is below Ketu",
  {
    lagna: lagna(1),
    planets: [planet("ketu", 192, 7), planet("jupiter", 186, 7)],
  },
  15,
  false
);

// RULE 16
// For each classical karaka, both its 2nd and 12th Rasis contain primary malefics.
// Sun in Aries: 2nd=Taurus, 12th=Pisces. Put Mars in Taurus and Saturn in Pisces.

test(
  "Rule 16 Positive - Sun hemmed by primary malefics",
  {
    lagna: lagna(1),
    planets: [
      planet("sun", 10, 1),
      planet("mars", 40, 2),
      planet("saturn", 350, 12),
    ],
  },
  16,
  true,
  (rule) => rule.details.matchedKarakas.includes("sun")
);

test(
  "Rule 16 Negative - Malefic present on only one side",
  {
    lagna: lagna(1),
    planets: [
      planet("sun", 10, 1),
      planet("mars", 40, 2),
      planet("saturn", 280, 10),
    ],
  },
  16,
  false
);

// RULE 17
// Retrograde planet in 5th or 9th house.
// Aries Lagna -> 5th Leo (5), 9th Sagittarius (9).

test(
  "Rule 17 Positive - Retrograde Saturn in 5th",
  {
    lagna: lagna(1),
    planets: [planet("saturn", 130, 5, true)],
  },
  17,
  true
);

test(
  "Rule 17 Negative - Non-retrograde planet in 5th",
  {
    lagna: lagna(1),
    planets: [planet("saturn", 130, 5, false)],
  },
  17,
  false
);

// RULE 18
// Saturn and Mars opposite Rasis.

test(
  "Rule 18 Positive - Saturn/Mars opposite Rasis",
  {
    lagna: lagna(1),
    planets: [planet("saturn", 10, 1), planet("mars", 190, 7)],
  },
  18,
  true
);

test(
  "Rule 18 Negative - Saturn/Mars not opposite",
  {
    lagna: lagna(1),
    planets: [planet("saturn", 10, 1), planet("mars", 100, 4)],
  },
  18,
  false
);

// RULE 19
// Sun and Saturn opposite Rasis.

test(
  "Rule 19 Positive - Sun/Saturn opposite Rasis",
  {
    lagna: lagna(1),
    planets: [planet("sun", 70, 3), planet("saturn", 250, 9)],
  },
  19,
  true
);

test(
  "Rule 19 Negative - Sun/Saturn not opposite",
  {
    lagna: lagna(1),
    planets: [planet("sun", 70, 3), planet("saturn", 160, 6)],
  },
  19,
  false
);

// RULE 20
// Aries Lagna -> 5th lord Sun.
// Sun at 0.10 Aries => segment 1 Ghora => malefic.
// Sun at 1.10 Aries => segment 3 Deva => non-malefic.

test(
  "Rule 20 Positive - 5th lord in Ghora Shashtiamsha",
  {
    lagna: lagna(1),
    planets: [planet("sun", 0.10, 1)],
  },
  20,
  true,
  (rule) => rule.details.shashtiamsha && rule.details.shashtiamsha.name === "Ghora"
);

test(
  "Rule 20 Negative - 5th lord in Deva Shashtiamsha",
  {
    lagna: lagna(1),
    planets: [planet("sun", 1.10, 1)],
  },
  20,
  false,
  (rule) => rule.details.shashtiamsha && rule.details.shashtiamsha.name === "Deva"
);

console.log("");
console.log("==============================================");
console.log(`TOTAL PASS : ${passCount}`);
console.log(`TOTAL FAIL : ${failCount}`);
console.log("==============================================");

if (failCount === 0) {
  console.log("RULES 11-20 BASIC UAT: PASS");
  process.exit(0);
} else {
  console.log("RULES 11-20 BASIC UAT: FAIL");
  process.exit(1);
}
