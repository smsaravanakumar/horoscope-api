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
console.log("NADI RULES 41-50 UAT");
console.log("====================================================");
console.log("");

// Rule 41: Mercury + Mars + Rahu in 2nd house.
// Aries Lagna => 2nd house Taurus (Rasi 2).
test("Rule 41 Positive - Mercury/Mars/Rahu in 2nd house", {
  lagna: lagna(1),
  planets: [
    planet("mercury", 35, 2),
    planet("mars", 42, 2),
    planet("rahu", 50, 2),
  ],
}, 41, true);

test("Rule 41 Negative - One planet outside 2nd house", {
  lagna: lagna(1),
  planets: [
    planet("mercury", 35, 2),
    planet("mars", 42, 2),
    planet("rahu", 65, 3),
  ],
}, 41, false);

// Rule 42: Ketu in 5th receiving Mars 4/7/8 aspect.
// Aries Lagna => 5th house Leo (Rasi 5).
test("Rule 42 Positive - Ketu in 5th with Mars 4th aspect", {
  lagna: lagna(1),
  planets: [
    planet("ketu", 130, 5),
    planet("mars", 40, 2),
  ],
}, 42, true);

test("Rule 42 Positive - Ketu in 5th with Mars 8th aspect", {
  lagna: lagna(1),
  planets: [
    planet("ketu", 130, 5),
    planet("mars", 280, 10),
  ],
}, 42, true);

test("Rule 42 Negative - Ketu in 5th without Mars 4/7/8 aspect", {
  lagna: lagna(1),
  planets: [
    planet("ketu", 130, 5),
    planet("mars", 70, 3),
  ],
}, 42, false);

// Rule 43: Ketu in 9th receiving Jupiter 5/7/9 aspect.
// Aries Lagna => 9th house Sagittarius (Rasi 9).
test("Rule 43 Positive - Ketu in 9th with Jupiter 5th aspect", {
  lagna: lagna(1),
  planets: [
    planet("ketu", 250, 9),
    planet("jupiter", 130, 5),
  ],
}, 43, true);

test("Rule 43 Negative - Ketu in 9th without Jupiter aspect", {
  lagna: lagna(1),
  planets: [
    planet("ketu", 250, 9),
    planet("jupiter", 40, 2),
  ],
}, 43, false);

// Rule 44: Saturn aspects Lagna's 12th by 3/7/10.
// Aries Lagna => 12th house Pisces (Rasi 12).
test("Rule 44 Positive - Saturn 3rd aspect to 12th house", {
  lagna: lagna(1),
  planets: [planet("saturn", 280, 10)],
}, 44, true);

test("Rule 44 Positive - Saturn 7th aspect to 12th house", {
  lagna: lagna(1),
  planets: [planet("saturn", 160, 6)],
}, 44, true);

test("Rule 44 Negative - Saturn does not aspect 12th house", {
  lagna: lagna(1),
  planets: [planet("saturn", 10, 1)],
}, 44, false);

// Rule 45: Sun+Rahu OR Mars+Rahu in fire sign.
test("Rule 45 Positive - Sun/Rahu together in Aries", {
  lagna: lagna(1),
  planets: [
    planet("sun", 10, 1),
    planet("rahu", 20, 1),
  ],
}, 45, true);

test("Rule 45 Positive - Mars/Rahu together in Leo", {
  lagna: lagna(1),
  planets: [
    planet("mars", 130, 5),
    planet("rahu", 140, 5),
  ],
}, 45, true);

test("Rule 45 Negative - Sun/Rahu together in non-fire sign", {
  lagna: lagna(1),
  planets: [
    planet("sun", 40, 2),
    planet("rahu", 50, 2),
  ],
}, 45, false);

// Rule 46: Venus + Rahu in 8th or 12th house.
// Aries Lagna => 8th Scorpio (8), 12th Pisces (12).
test("Rule 46 Positive - Venus/Rahu in 8th house", {
  lagna: lagna(1),
  planets: [
    planet("venus", 220, 8),
    planet("rahu", 230, 8),
  ],
}, 46, true);

test("Rule 46 Positive - Venus/Rahu in 12th house", {
  lagna: lagna(1),
  planets: [
    planet("venus", 340, 12),
    planet("rahu", 350, 12),
  ],
}, 46, true);

test("Rule 46 Negative - Venus/Rahu together outside 8th/12th", {
  lagna: lagna(1),
  planets: [
    planet("venus", 100, 4),
    planet("rahu", 110, 4),
  ],
}, 46, false);

// Rule 47: Moon + Saturn in 2nd house.
test("Rule 47 Positive - Moon/Saturn in 2nd house", {
  lagna: lagna(1),
  planets: [
    planet("moon", 35, 2),
    planet("saturn", 50, 2),
  ],
}, 47, true);

test("Rule 47 Negative - Moon/Saturn together but not in 2nd", {
  lagna: lagna(1),
  planets: [
    planet("moon", 65, 3),
    planet("saturn", 70, 3),
  ],
}, 47, false);

// Rule 48: Jupiter + Ketu conjunction with Saturn aspect.
test("Rule 48 Positive - Jupiter/Ketu with Saturn 7th aspect", {
  lagna: lagna(1),
  planets: [
    planet("jupiter", 130, 5),
    planet("ketu", 140, 5),
    planet("saturn", 310, 11),
  ],
}, 48, true);

test("Rule 48 Negative - Jupiter/Ketu without Saturn aspect", {
  lagna: lagna(1),
  planets: [
    planet("jupiter", 130, 5),
    planet("ketu", 140, 5),
    planet("saturn", 10, 1),
  ],
}, 48, false);

// Rule 49: Mars in 4th and either debilitated in Cancer or conjunct Ketu.
// Aries Lagna => 4th Cancer, so Mars is debilitated there.
test("Rule 49 Positive - Mars debilitated in 4th house", {
  lagna: lagna(1),
  planets: [planet("mars", 100, 4)],
}, 49, true);

// Taurus Lagna => 4th Leo; Mars is not debilitated but Ketu conjunction qualifies.
test("Rule 49 Positive - Mars in 4th with Ketu conjunction", {
  lagna: lagna(2),
  planets: [
    planet("mars", 130, 5),
    planet("ketu", 140, 5),
  ],
}, 49, true);

test("Rule 49 Negative - Mars in 4th neither debilitated nor with Ketu", {
  lagna: lagna(2),
  planets: [
    planet("mars", 130, 5),
    planet("ketu", 200, 7),
  ],
}, 49, false);

// Rule 50: Sun + Mercury + Rahu in 6th house.
// Aries Lagna => 6th Virgo (Rasi 6).
test("Rule 50 Positive - Sun/Mercury/Rahu in 6th house", {
  lagna: lagna(1),
  planets: [
    planet("sun", 155, 6),
    planet("mercury", 160, 6),
    planet("rahu", 170, 6),
  ],
}, 50, true);

test("Rule 50 Negative - One planet outside 6th house", {
  lagna: lagna(1),
  planets: [
    planet("sun", 155, 6),
    planet("mercury", 160, 6),
    planet("rahu", 190, 7),
  ],
}, 50, false);

console.log("");
console.log("====================================================");
console.log(`TOTAL PASS : ${passCount}`);
console.log(`TOTAL FAIL : ${failCount}`);
console.log("====================================================");

if (failCount === 0) {
  console.log("RULES 41-50 BASIC UAT: PASS");
  process.exit(0);
} else {
  console.log("RULES 41-50 BASIC UAT: FAIL");
  process.exit(1);
}
