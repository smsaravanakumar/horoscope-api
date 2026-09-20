const { buildNadiRuleAnalysis } = require("../services/nadiRuleService");

function rasiFromLongitude(longitude) {
  return Math.floor((((longitude % 360) + 360) % 360) / 30) + 1;
}

function planet(key, longitude, rasiNo = null, retrograde = false) {
  return {
    key,
    longitude,
    rasiNo: rasiNo ?? rasiFromLongitude(longitude),
    retrograde,
  };
}

function lagna(rasiNo) {
  return { key: "lagna", rasiNo };
}

function getRule(result, ruleNo) {
  return result.ruleResults.find((r) => r.ruleNo === ruleNo);
}

let passCount = 0;
let failCount = 0;

function test(title, input, ruleNo, expected) {
  const result = buildNadiRuleAnalysis(input);
  const rule = getRule(result, ruleNo);
  const ok = Boolean(rule) && rule.matched === expected;

  console.log(`${title}: ${ok ? "PASS" : "FAIL"}`);
  if (!ok) {
    console.log("  Expected:", expected);
    console.log("  Actual  :", rule ? rule.matched : "Rule not found");
    console.log("  Details :", rule ? rule.details : null);
  }

  if (ok) passCount++;
  else failCount++;
}

console.log("");
console.log("==============================================");
console.log("NADI RULES 21-30 UAT");
console.log("==============================================");
console.log("");

// Rule 21: Mudakku star 1/5/9 has Saturn or Rahu.
// Sun in Mula (Nakshatra 19) => Mudakku = Purva Ashadha (20).
// 1/5/9 targets = 20, 24, 1.
test(
  "Rule 21 Positive - Saturn in 5th Nakshatra from Mudakku",
  {
    lagna: lagna(1),
    planets: [
      planet("sun", 245),       // Nakshatra 19
      planet("saturn", 308),    // Nakshatra 24
      planet("rahu", 120),
    ],
  },
  21,
  true
);

test(
  "Rule 21 Negative - Saturn/Rahu outside Mudakku 1-5-9",
  {
    lagna: lagna(1),
    planets: [
      planet("sun", 245),
      planet("saturn", 280),    // Nakshatra 22
      planet("rahu", 140),      // Nakshatra 11
    ],
  },
  21,
  false
);

// Rule 22: 8th lord conjunct Rahu.
// Aries Lagna => 8th sign Scorpio => lord Mars.
test(
  "Rule 22 Positive - 8th lord Mars conjunct Rahu",
  {
    lagna: lagna(1),
    planets: [
      planet("mars", 220, 8),
      planet("rahu", 230, 8),
    ],
  },
  22,
  true
);

test(
  "Rule 22 Negative - 8th lord not conjunct Rahu",
  {
    lagna: lagna(1),
    planets: [
      planet("mars", 220, 8),
      planet("rahu", 260, 9),
    ],
  },
  22,
  false
);

// Rule 23: Mercury 5th or 9th from Jupiter.
test(
  "Rule 23 Positive - Mercury 5th from Jupiter",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 10, 1),
      planet("mercury", 130, 5),
    ],
  },
  23,
  true
);

test(
  "Rule 23 Negative - Mercury not 5th/9th from Jupiter",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 10, 1),
      planet("mercury", 100, 4),
    ],
  },
  23,
  false
);

// Rule 24: Ketu alone in 12th with benefic aspect.
test(
  "Rule 24 Positive - Ketu alone in 12th with Jupiter aspect",
  {
    lagna: lagna(1),
    planets: [
      planet("ketu", 350, 12),
      planet("jupiter", 220, 8),
    ],
    aspects: [
      { fromKey: "jupiter", toRasi: 12, aspect: 5 },
    ],
  },
  24,
  true
);

test(
  "Rule 24 Negative - Ketu alone in 12th without benefic aspect",
  {
    lagna: lagna(1),
    planets: [
      planet("ketu", 350, 12),
      planet("jupiter", 220, 8),
    ],
    aspects: [],
  },
  24,
  false
);

// Rule 25: 9th lord in 12th with Ketu relation.
// Aries Lagna => 9th lord Jupiter. Ketu in Virgo gives 7th relation to Pisces.
test(
  "Rule 25 Positive - 9th lord in 12th with Ketu relation",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 350, 12),
      planet("ketu", 170, 6),
    ],
  },
  25,
  true
);

test(
  "Rule 25 Negative - 9th lord in 12th without Ketu relation",
  {
    lagna: lagna(1),
    planets: [
      planet("jupiter", 350, 12),
      planet("ketu", 130, 5),
    ],
  },
  25,
  false
);

// Rule 26: all seven classical planets enclosed by Rahu-Ketu axis.
test(
  "Rule 26 Positive - All seven planets within Rahu-Ketu enclosure",
  {
    lagna: lagna(1),
    planets: [
      planet("rahu", 260),
      planet("ketu", 80),
      planet("sun", 300),
      planet("moon", 20),
      planet("mars", 270),
      planet("mercury", 330),
      planet("jupiter", 40),
      planet("venus", 60),
      planet("saturn", 70),
    ],
  },
  26,
  true
);

test(
  "Rule 26 Negative - One planet outside enclosure",
  {
    lagna: lagna(1),
    planets: [
      planet("rahu", 260),
      planet("ketu", 80),
      planet("sun", 300),
      planet("moon", 20),
      planet("mars", 150),
      planet("mercury", 330),
      planet("jupiter", 40),
      planet("venus", 60),
      planet("saturn", 70),
    ],
  },
  26,
  false
);

// Rule 27: Saturn/Rahu in Tara positions 3,5,7 from Moon's Janma Nakshatra.
test(
  "Rule 27 Positive - Saturn in Vipat Tara (3rd)",
  {
    lagna: lagna(1),
    planets: [
      planet("moon", 1),       // Nakshatra 1
      planet("saturn", 28),    // Nakshatra 3
      planet("rahu", 50),
    ],
  },
  27,
  true
);

test(
  "Rule 27 Negative - Saturn/Rahu outside Tara 3/5/7",
  {
    lagna: lagna(1),
    planets: [
      planet("moon", 1),
      planet("saturn", 15),    // Nakshatra 2 => Tara 2
      planet("rahu", 42),      // Nakshatra 4 => Tara 4
    ],
  },
  27,
  false
);

// Rule 28: Sun + Moon + Rahu/Ketu same Rasi.
test(
  "Rule 28 Positive - Sun Moon Rahu same Rasi",
  {
    lagna: lagna(1),
    planets: [
      planet("sun", 95, 4),
      planet("moon", 100, 4),
      planet("rahu", 110, 4),
      planet("ketu", 290, 10),
    ],
  },
  28,
  true
);

test(
  "Rule 28 Negative - Sun Moon together but node elsewhere",
  {
    lagna: lagna(1),
    planets: [
      planet("sun", 95, 4),
      planet("moon", 100, 4),
      planet("rahu", 140, 5),
      planet("ketu", 320, 11),
    ],
  },
  28,
  false
);

// Rule 29: Mercury + Ketu <= 3 degrees.
test(
  "Rule 29 Positive - Mercury/Ketu within 3 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("mercury", 100),
      planet("ketu", 102.5),
    ],
  },
  29,
  true
);

test(
  "Rule 29 Negative - Mercury/Ketu more than 3 degrees",
  {
    lagna: lagna(1),
    planets: [
      planet("mercury", 100),
      planet("ketu", 104),
    ],
  },
  29,
  false
);

// Rule 30: Mars + Saturn in 4th house.
// Aries Lagna => 4th house Cancer = Rasi 4.
test(
  "Rule 30 Positive - Mars and Saturn in 4th house",
  {
    lagna: lagna(1),
    planets: [
      planet("mars", 95, 4),
      planet("saturn", 110, 4),
    ],
  },
  30,
  true
);

test(
  "Rule 30 Negative - Only Mars in 4th house",
  {
    lagna: lagna(1),
    planets: [
      planet("mars", 95, 4),
      planet("saturn", 140, 5),
    ],
  },
  30,
  false
);

console.log("");
console.log("==============================================");
console.log(`TOTAL PASS : ${passCount}`);
console.log(`TOTAL FAIL : ${failCount}`);
console.log("==============================================");

if (failCount === 0) {
  console.log("RULES 21-30 BASIC UAT: PASS");
  process.exit(0);
} else {
  console.log("RULES 21-30 BASIC UAT: FAIL");
  process.exit(1);
}
