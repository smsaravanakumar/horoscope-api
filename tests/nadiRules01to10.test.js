const { buildNadiRuleAnalysis } = require("../services/nadiRuleService");

function planet(key, longitude, rasiNo, retrograde = false) {
  return {
    key,
    longitude,
    rasiNo,
    retrograde,
  };
}

function lagna(rasiNo) {
  return {
    key: "lagna",
    rasiNo,
  };
}

function getRule(result, ruleNo) {
  return result.ruleResults.find((r) => r.ruleNo === ruleNo);
}

function runCase(title, input, expectedRuleNo, expectedMatched) {
  const result = buildNadiRuleAnalysis(input);
  const rule = getRule(result, expectedRuleNo);

  const passed =
    rule &&
    rule.matched === expectedMatched;

  console.log(
    `${title}: ${passed ? "PASS" : "FAIL"}`
  );

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

  if (ok) {
    passCount++;
  } else {
    failCount++;
  }
}

console.log("");
console.log("==============================================");
console.log("NADI RULES 01-10 UAT");
console.log("==============================================");
console.log("");

//
// RULE 1
// Jupiter + Rahu <= 5 degrees
//

test(
  "Rule 1 Positive - Jupiter/Rahu within 5 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 100, 4),
      planet("rahu", 104, 4),
    ],
  },
  1,
  true
);

test(
  "Rule 1 Negative - Jupiter/Rahu more than 5 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 100, 4),
      planet("rahu", 106, 4),
    ],
  },
  1,
  false
);


//
// RULE 2
// Sun + Rahu or Ketu <= 5 degrees
//

test(
  "Rule 2 Positive - Sun/Rahu within 5 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("sun", 50, 2),
      planet("rahu", 54, 2),
      planet("ketu", 234, 8),
    ],
  },
  2,
  true
);

test(
  "Rule 2 Negative - Sun not within 5 degrees of Rahu/Ketu",
  {
    lagna: lagna(1),
    planets: [
      planet("sun", 50, 2),
      planet("rahu", 70, 3),
      planet("ketu", 250, 9),
    ],
  },
  2,
  false
);


//
// RULE 3
// Moon + Ketu or Saturn <= 5 degrees
//

test(
  "Rule 3 Positive - Moon/Saturn within 5 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("moon", 80, 3),
      planet("saturn", 84, 3),
      planet("ketu", 260, 9),
    ],
  },
  3,
  true
);

test(
  "Rule 3 Negative - Moon not within 5 degrees of Ketu/Saturn",
  {
    lagna: lagna(1),
    planets: [
      planet("moon", 80, 3),
      planet("saturn", 100, 4),
      planet("ketu", 260, 9),
    ],
  },
  3,
  false
);


//
// RULE 4
// Mars + Rahu or Ketu <= 5 degrees
//

test(
  "Rule 4 Positive - Mars/Ketu within 5 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("mars", 200, 7),
      planet("ketu", 204, 7),
      planet("rahu", 24, 1),
    ],
  },
  4,
  true
);

test(
  "Rule 4 Negative - Mars not within 5 degrees of Rahu/Ketu",
  {
    lagna: lagna(1),
    planets: [
      planet("mars", 200, 7),
      planet("ketu", 220, 8),
      planet("rahu", 40, 2),
    ],
  },
  4,
  false
);


//
// RULE 5
// Venus + Ketu <= 5 degrees
//

test(
  "Rule 5 Positive - Venus/Ketu within 5 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("venus", 150, 6),
      planet("ketu", 154, 6),
    ],
  },
  5,
  true
);

test(
  "Rule 5 Negative - Venus/Ketu more than 5 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("venus", 150, 6),
      planet("ketu", 160, 6),
    ],
  },
  5,
  false
);


//
// RULE 6
// Saturn + Mars same sign OR opposite signs
// Client confirmed opposite Rasi itself is sufficient.
//

test(
  "Rule 6 Positive - Saturn and Mars same Rasi",
  {
    lagna: lagna(1),
    planets: [
      planet("saturn", 10, 1),
      planet("mars", 20, 1),
    ],
  },
  6,
  true
);

test(
  "Rule 6 Positive - Saturn and Mars opposite Rasis",
  {
    lagna: lagna(1),
    planets: [
      planet("saturn", 10, 1),
      planet("mars", 190, 7),
    ],
  },
  6,
  true
);

test(
  "Rule 6 Negative - Saturn and Mars neither same nor opposite",
  {
    lagna: lagna(1),
    planets: [
      planet("saturn", 10, 1),
      planet("mars", 100, 4),
    ],
  },
  6,
  false
);


//
// RULE 7
// Mercury + Rahu or Saturn <= 5 degrees
//

test(
  "Rule 7 Positive - Mercury/Rahu within 5 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("mercury", 120, 5),
      planet("rahu", 124, 5),
      planet("saturn", 280, 10),
    ],
  },
  7,
  true
);

test(
  "Rule 7 Negative - Mercury not within 5 degrees of Rahu/Saturn",
  {
    lagna: lagna(1),
    planets: [
      planet("mercury", 120, 5),
      planet("rahu", 140, 5),
      planet("saturn", 200, 7),
    ],
  },
  7,
  false
);


//
// RULE 8
// Saturn or Ketu in 5th house
//
// Lagna Aries = 5th house Leo = Rasi 5
//

test(
  "Rule 8 Positive - Saturn in 5th house",
  {
    lagna: lagna(1),
    planets: [
      planet("saturn", 130, 5),
      planet("ketu", 250, 9),
    ],
  },
  8,
  true
);

test(
  "Rule 8 Positive - Ketu in 5th house",
  {
    lagna: lagna(1),
    planets: [
      planet("saturn", 200, 7),
      planet("ketu", 130, 5),
    ],
  },
  8,
  true
);

test(
  "Rule 8 Negative - Saturn/Ketu not in 5th house",
  {
    lagna: lagna(1),
    planets: [
      planet("saturn", 200, 7),
      planet("ketu", 250, 9),
    ],
  },
  8,
  false
);


//
// RULE 9
// 9th lord in 8th or 12th
//
// Lagna Aries:
// 9th house = Sagittarius
// 9th lord = Jupiter
// 8th house = Scorpio = Rasi 8
// 12th house = Pisces = Rasi 12
//

test(
  "Rule 9 Positive - 9th lord in 8th house",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 220, 8),
    ],
  },
  9,
  true
);

test(
  "Rule 9 Positive - 9th lord in 12th house",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 350, 12),
    ],
  },
  9,
  true
);

test(
  "Rule 9 Negative - 9th lord not in 8th/12th",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 270, 10),
    ],
  },
  9,
  false
);


//
// RULE 10
// Saturn + Ketu same Rasi
//

test(
  "Rule 10 Positive - Saturn/Ketu same Rasi",
  {
    lagna: lagna(1),
    planets: [
      planet("saturn", 305, 11),
      planet("ketu", 320, 11),
    ],
  },
  10,
  true
);

test(
  "Rule 10 Negative - Saturn/Ketu different Rasis",
  {
    lagna: lagna(1),
    planets: [
      planet("saturn", 305, 11),
      planet("ketu", 350, 12),
    ],
  },
  10,
  false
);


//
// FINAL RESULT
//

console.log("");
console.log("==============================================");
console.log(`TOTAL PASS : ${passCount}`);
console.log(`TOTAL FAIL : ${failCount}`);
console.log("==============================================");

if (failCount === 0) {
  console.log("RULES 1-10 BASIC UAT: PASS");
  process.exit(0);
} else {
  console.log("RULES 1-10 BASIC UAT: FAIL");
  process.exit(1);
}