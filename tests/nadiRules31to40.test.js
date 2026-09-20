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
console.log("NADI RULES 31-40 UAT");
console.log("====================================================");
console.log("");

// Rule 31: Lagna lord in 8th/12th together with Rahu.
test("Rule 31 Positive - Lagna lord in 8th with Rahu", {
  lagna: lagna(1),
  planets: [planet("mars", 215, 8), planet("rahu", 220, 8)],
}, 31, true);

test("Rule 31 Positive - Lagna lord in 12th with Rahu", {
  lagna: lagna(1),
  planets: [planet("mars", 345, 12), planet("rahu", 350, 12)],
}, 31, true);

test("Rule 31 Negative - Lagna lord in 8th without Rahu conjunction", {
  lagna: lagna(1),
  planets: [planet("mars", 215, 8), planet("rahu", 250, 9)],
}, 31, false);

// Rule 32: Venus in 6th with Rahu/Mars aspect.
test("Rule 32 Positive - Venus in 6th with Rahu aspect", {
  lagna: lagna(1),
  planets: [planet("venus", 160, 6), planet("rahu", 340, 12)],
  aspects: [{ fromKey: "rahu", toRasi: 6, aspect: 7 }],
}, 32, true);

test("Rule 32 Positive - Venus in 6th with Mars aspect", {
  lagna: lagna(1),
  planets: [planet("venus", 160, 6), planet("mars", 70, 3)],
  aspects: [{ fromKey: "mars", toRasi: 6, aspect: 4 }],
}, 32, true);

test("Rule 32 Negative - Venus in 6th without Rahu/Mars aspect", {
  lagna: lagna(1),
  planets: [planet("venus", 160, 6), planet("rahu", 40, 2), planet("mars", 100, 4)],
  aspects: [],
}, 32, false);

// Rule 33: Retrograde Jupiter in 5th/9th.
test("Rule 33 Positive - Retrograde Jupiter in 5th", {
  lagna: lagna(1),
  planets: [planet("jupiter", 130, 5, true)],
}, 33, true);

test("Rule 33 Positive - Retrograde Jupiter in 9th", {
  lagna: lagna(1),
  planets: [planet("jupiter", 250, 9, true)],
}, 33, true);

test("Rule 33 Negative - Jupiter in 5th but not retrograde", {
  lagna: lagna(1),
  planets: [planet("jupiter", 130, 5, false)],
}, 33, false);

// Rule 34: 12th lord in Ashwini/Magha/Mula (Ketu stars).
// Aries Lagna => 12th lord Jupiter.
test("Rule 34 Positive - 12th lord Jupiter in Ashwini", {
  lagna: lagna(1),
  planets: [planet("jupiter", 5, 1)],
}, 34, true);

test("Rule 34 Positive - 12th lord Jupiter in Magha", {
  lagna: lagna(1),
  planets: [planet("jupiter", 125, 5)],
}, 34, true);

test("Rule 34 Negative - 12th lord not in Ketu star", {
  lagna: lagna(1),
  planets: [planet("jupiter", 20, 1)],
}, 34, false);

// Rule 35: 5th/9th lord Dasha with Rahu/Ketu Bhukti.
// Aries Lagna => 5th lord Sun, 9th lord Jupiter.
test("Rule 35 Positive - 5th lord Sun Dasha / Rahu Bhukti", {
  lagna: lagna(1),
  planets: [planet("sun", 10, 1), planet("jupiter", 250, 9)],
  dasha: { currentDasha: "சூரியன்", currentBhukti: "ராகு" },
}, 35, true);

test("Rule 35 Positive - 9th lord Jupiter Dasha / Ketu Bhukti", {
  lagna: lagna(1),
  planets: [planet("sun", 10, 1), planet("jupiter", 250, 9)],
  dasha: { currentDasha: "Jupiter", currentBhukti: "Ketu" },
}, 35, true);

test("Rule 35 Negative - Non-qualifying Dasha lord", {
  lagna: lagna(1),
  planets: [planet("sun", 10, 1), planet("jupiter", 250, 9)],
  dasha: { currentDasha: "Mars", currentBhukti: "Rahu" },
}, 35, false);

// Rule 36: Sun + Ketu in water sign.
test("Rule 36 Positive - Sun/Ketu together in Cancer", {
  lagna: lagna(1),
  planets: [planet("sun", 100, 4), planet("ketu", 110, 4)],
}, 36, true);

test("Rule 36 Negative - Sun/Ketu together but in Leo", {
  lagna: lagna(1),
  planets: [planet("sun", 130, 5), planet("ketu", 140, 5)],
}, 36, false);

// Rule 37: Jupiter + Venus together in trine from 2nd/11th, no malefic relation.
// Aries Lagna: 2nd house Taurus (2); its trines are 2,6,10. Use Virgo (6).
test("Rule 37 Positive - Jupiter/Venus in clean trine from 2nd", {
  lagna: lagna(1),
  planets: [
    planet("jupiter", 160, 6), planet("venus", 165, 6),
    planet("saturn", 10, 1), planet("mars", 40, 2), planet("rahu", 70, 3), planet("ketu", 250, 9),
  ],
  aspects: [],
}, 37, true);

test("Rule 37 Negative - Same yoga but Saturn aspects conjunction sign", {
  lagna: lagna(1),
  planets: [
    planet("jupiter", 160, 6), planet("venus", 165, 6),
    planet("saturn", 250, 9), planet("mars", 40, 2), planet("rahu", 70, 3), planet("ketu", 250, 9),
  ],
  aspects: [{ fromKey: "saturn", toRasi: 6, aspect: 10 }],
}, 37, false);

// Rule 38: Jupiter & Saturn both retrograde + mutual aspect or trinal relation.
test("Rule 38 Positive - Both retrograde and trinal", {
  lagna: lagna(1),
  planets: [planet("jupiter", 10, 1, true), planet("saturn", 130, 5, true)],
  aspects: [],
}, 38, true);

test("Rule 38 Positive - Both retrograde and mutual aspect", {
  lagna: lagna(1),
  planets: [planet("jupiter", 10, 1, true), planet("saturn", 190, 7, true)],
  aspects: [
    { fromKey: "jupiter", toRasi: 7, aspect: 7 },
    { fromKey: "saturn", toRasi: 1, aspect: 7 },
  ],
}, 38, true);

test("Rule 38 Negative - Saturn not retrograde", {
  lagna: lagna(1),
  planets: [planet("jupiter", 10, 1, true), planet("saturn", 130, 5, false)],
  aspects: [],
}, 38, false);

// Rule 39: Moon + Mars in 5th and Ketu aspect.
test("Rule 39 Positive - Moon/Mars in 5th with Ketu 7th aspect", {
  lagna: lagna(1),
  planets: [planet("moon", 130, 5), planet("mars", 140, 5), planet("ketu", 310, 11)],
  aspects: [{ fromKey: "ketu", toRasi: 5, aspect: 7 }],
}, 39, true);

test("Rule 39 Negative - Moon/Mars in 5th without Ketu aspect", {
  lagna: lagna(1),
  planets: [planet("moon", 130, 5), planet("mars", 140, 5), planet("ketu", 280, 10)],
  aspects: [],
}, 39, false);

// Rule 40: Jupiter alone outside Rahu-Ketu enclosure.
test("Rule 40 Positive - Only Jupiter outside enclosure", {
  lagna: lagna(1),
  planets: [
    planet("sun", 10, 1),
    planet("moon", 35, 2),
    planet("mars", 65, 3),
    planet("mercury", 95, 4),
    planet("venus", 125, 5),
    planet("saturn", 155, 6),
    planet("jupiter", 220, 8),
    planet("rahu", 0, 1),
    planet("ketu", 180, 7),
  ],
}, 40, true);

test("Rule 40 Negative - Jupiter also inside enclosure", {
  lagna: lagna(1),
  planets: [
    planet("sun", 10, 1),
    planet("moon", 35, 2),
    planet("mars", 65, 3),
    planet("mercury", 95, 4),
    planet("venus", 125, 5),
    planet("saturn", 155, 6),
    planet("jupiter", 170, 6),
    planet("rahu", 0, 1),
    planet("ketu", 180, 7),
  ],
}, 40, false);

console.log("");
console.log("====================================================");
console.log(`TOTAL PASS : ${passCount}`);
console.log(`TOTAL FAIL : ${failCount}`);
console.log("====================================================");

if (failCount === 0) {
  console.log("RULES 31-40 BASIC UAT: PASS");
  process.exit(0);
} else {
  console.log("RULES 31-40 BASIC UAT: FAIL");
  process.exit(1);
}
