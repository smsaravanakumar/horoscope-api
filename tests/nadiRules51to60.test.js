const { buildNadiRuleAnalysis } = require("../services/nadiRuleService");

function rasiFromLongitude(longitude) {
  let value = Number(longitude) % 360;
  if (value < 0) value += 360;
  return Math.floor(value / 30) + 1;
}

function planet(key, longitude, rasiNo = null, retrograde = false) {
  return {
    key,
    longitude,
    rasiNo: rasiNo || rasiFromLongitude(longitude),
    retrograde,
  };
}

function lagna(rasiNo) {
  return { key: "lagna", rasiNo };
}

function getRule(result, ruleNo) {
  return result.ruleResults.find((r) => r.ruleNo === ruleNo);
}

function runCase(title, input, expectedRuleNo, expectedMatched) {
  const result = buildNadiRuleAnalysis(input);
  const rule = getRule(result, expectedRuleNo);
  const passed = Boolean(rule) && rule.matched === expectedMatched;

  console.log(`${title}: ${passed ? "PASS" : "FAIL"}`);
  if (!passed) {
    console.log("  Expected:", expectedMatched);
    console.log("  Actual  :", rule ? rule.matched : "Rule not found");
    console.log("  Details :", rule ? rule.details : null);
  }
  return passed;
}

let passCount = 0;
let failCount = 0;

function test(title, input, ruleNo, expected) {
  const ok = runCase(title, input, ruleNo, expected);
  if (ok) passCount++;
  else failCount++;
}

console.log("");
console.log("====================================================");
console.log("NADI RULES 51-60 UAT");
console.log("====================================================");
console.log("");

// Rule 51: Mars + Venus + Ketu in 7th or 8th.
test("Rule 51 Positive - Mars/Venus/Ketu in 7th house", {
  lagna: lagna(1),
  planets: [planet("mars", 185, 7), planet("venus", 190, 7), planet("ketu", 200, 7)],
}, 51, true);

test("Rule 51 Positive - Mars/Venus/Ketu in 8th house", {
  lagna: lagna(1),
  planets: [planet("mars", 215, 8), planet("venus", 220, 8), planet("ketu", 230, 8)],
}, 51, true);

test("Rule 51 Negative - Same conjunction outside 7th/8th", {
  lagna: lagna(1),
  planets: [planet("mars", 95, 4), planet("venus", 100, 4), planet("ketu", 110, 4)],
}, 51, false);

// Rule 52: 5th lord in 6th and conjunct Rahu. Aries Lagna => 5th lord Sun, 6th = Virgo.
test("Rule 52 Positive - 5th lord Sun in 6th with Rahu", {
  lagna: lagna(1),
  planets: [planet("sun", 160, 6), planet("rahu", 170, 6)],
}, 52, true);

test("Rule 52 Negative - 5th lord in 6th without Rahu", {
  lagna: lagna(1),
  planets: [planet("sun", 160, 6), planet("rahu", 200, 7)],
}, 52, false);

// Rule 53: Saturn and Ketu each alone in 1/5/9.
test("Rule 53 Positive - Saturn in 5th and Ketu in 9th, both alone", {
  lagna: lagna(1),
  planets: [planet("saturn", 130, 5), planet("ketu", 250, 9)],
}, 53, true);

test("Rule 53 Negative - Saturn not alone", {
  lagna: lagna(1),
  planets: [planet("saturn", 130, 5), planet("moon", 140, 5), planet("ketu", 250, 9)],
}, 53, false);

test("Rule 53 Negative - Ketu outside 1/5/9", {
  lagna: lagna(1),
  planets: [planet("saturn", 130, 5), planet("ketu", 190, 7)],
}, 53, false);

// Rule 54: 1/5/9 lords conjunction/aspect/exchange. Aries => Mars/Sun/Jupiter.
test("Rule 54 Positive - Lagna lord Mars conjunct 5th lord Sun", {
  lagna: lagna(1),
  planets: [planet("mars", 40, 2), planet("sun", 50, 2), planet("jupiter", 250, 9)],
}, 54, true);

test("Rule 54 Positive - 5th lord Sun aspects 9th lord Jupiter", {
  lagna: lagna(1),
  planets: [planet("mars", 40, 2), planet("sun", 100, 4), planet("jupiter", 280, 10)],
  aspects: [{ fromKey: "sun", toRasi: 10 }],
}, 54, true);

test("Rule 54 Negative - No relation among 1/5/9 lords", {
  lagna: lagna(1),
  planets: [planet("mars", 10, 1), planet("sun", 100, 4), planet("jupiter", 250, 9)],
  aspects: [],
}, 54, false);

// Rule 55: 8th lord + Moon + Ketu in 8th or 12th. Aries => 8th lord Mars.
test("Rule 55 Positive - 8th lord Mars/Moon/Ketu in 8th", {
  lagna: lagna(1),
  planets: [planet("mars", 215, 8), planet("moon", 220, 8), planet("ketu", 230, 8)],
}, 55, true);

test("Rule 55 Negative - Conjunction outside 8th/12th", {
  lagna: lagna(1),
  planets: [planet("mars", 95, 4), planet("moon", 100, 4), planet("ketu", 110, 4)],
}, 55, false);

// Rule 56: Saturn + Sun + Rahu in 6th or 8th.
test("Rule 56 Positive - Saturn/Sun/Rahu in 6th", {
  lagna: lagna(1),
  planets: [planet("saturn", 155, 6), planet("sun", 160, 6), planet("rahu", 170, 6)],
}, 56, true);

test("Rule 56 Positive - Saturn/Sun/Rahu in 8th", {
  lagna: lagna(1),
  planets: [planet("saturn", 215, 8), planet("sun", 220, 8), planet("rahu", 230, 8)],
}, 56, true);

test("Rule 56 Negative - One planet outside conjunction", {
  lagna: lagna(1),
  planets: [planet("saturn", 155, 6), planet("sun", 160, 6), planet("rahu", 190, 7)],
}, 56, false);

// Rule 57: exact 180-degree opposition to Saturn.
test("Rule 57 Positive - Mars exactly 180 degrees opposite Saturn", {
  lagna: lagna(1),
  planets: [planet("saturn", 10, 1), planet("mars", 190, 7)],
}, 57, true);

test("Rule 57 Negative - Mars is 179.9 degrees from Saturn", {
  lagna: lagna(1),
  planets: [planet("saturn", 10, 1), planet("mars", 189.9, 7)],
}, 57, false);

// Rule 58: Sun + Mars + Ketu in 5th or 9th.
test("Rule 58 Positive - Sun/Mars/Ketu in 5th", {
  lagna: lagna(1),
  planets: [planet("sun", 125, 5), planet("mars", 135, 5), planet("ketu", 145, 5)],
}, 58, true);

test("Rule 58 Negative - Conjunction outside 5th/9th", {
  lagna: lagna(1),
  planets: [planet("sun", 185, 7), planet("mars", 195, 7), planet("ketu", 205, 7)],
}, 58, false);

// Rule 59: 9th/10th lord exchanges with 6th/8th lord.
// Aries: 9th lord Jupiter, 6th lord Mercury. Exchange => Jupiter in Virgo (6), Mercury in Sagittarius (9).
test("Rule 59 Positive - 9th lord Jupiter exchanges with 6th lord Mercury", {
  lagna: lagna(1),
  planets: [planet("jupiter", 160, 6), planet("mercury", 250, 9)],
}, 59, true);

test("Rule 59 Negative - No cross-group exchange", {
  lagna: lagna(1),
  planets: [planet("jupiter", 250, 9), planet("mercury", 160, 6), planet("saturn", 280, 10), planet("mars", 220, 8)],
}, 59, false);

// Rule 60: Mars + Mercury + Ketu in Lagna or 8th.
test("Rule 60 Positive - Mars/Mercury/Ketu in Lagna", {
  lagna: lagna(1),
  planets: [planet("mars", 5, 1), planet("mercury", 15, 1), planet("ketu", 25, 1)],
}, 60, true);

test("Rule 60 Positive - Mars/Mercury/Ketu in 8th", {
  lagna: lagna(1),
  planets: [planet("mars", 215, 8), planet("mercury", 225, 8), planet("ketu", 235, 8)],
}, 60, true);

test("Rule 60 Negative - Same conjunction outside Lagna/8th", {
  lagna: lagna(1),
  planets: [planet("mars", 95, 4), planet("mercury", 105, 4), planet("ketu", 115, 4)],
}, 60, false);

console.log("");
console.log("====================================================");
console.log(`TOTAL PASS : ${passCount}`);
console.log(`TOTAL FAIL : ${failCount}`);
console.log("====================================================");

if (failCount === 0) {
  console.log("RULES 51-60 BASIC UAT: PASS");
  process.exit(0);
} else {
  console.log("RULES 51-60 BASIC UAT: FAIL");
  process.exit(1);
}
