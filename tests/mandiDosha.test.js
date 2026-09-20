const assert = require("assert");
const { buildMandiDosha } = require("../services/mandiDoshaService");

let pass = 0;
let fail = 0;

function check(label, fn) {
  try {
    fn();
    pass += 1;
    console.log(`PASS: ${label}`);
  } catch (error) {
    fail += 1;
    console.error(`FAIL: ${label}`);
    console.error(`      ${error.message}`);
  }
}

function evaluate(house, language = "ta") {
  const lagnaRasiNo = 1;
  const mandiRasiNo = ((lagnaRasiNo + house - 2) % 12) + 1;
  return buildMandiDosha({
    lagna: { key: "lagna", rasiNo: lagnaRasiNo },
    planets: [{ key: "mandi", rasiNo: mandiRasiNo }],
    language,
  });
}

for (const house of [1, 2, 4, 5, 7, 8, 9, 10, 12]) {
  check(`Mandi Dosha positive in house ${house}`, () => {
    const result = evaluate(house);
    assert.equal(result.evaluated, true);
    assert.equal(result.result, true);
    assert.equal(result.house, house);
    assert.ok(result.problem);
    assert.deepEqual(result.remedyTemples, ["திருநாரையூர் கோயில்", "திருவல்லங்காடு கோயில்"]);
    assert.equal(result.remedy, "பிரேதம் அடக்கம் செய்ய உதவி செய்ய வேண்டும்");
  });
}

for (const house of [3, 6, 11]) {
  check(`Mandi Dosha absent in exempt house ${house}`, () => {
    const result = evaluate(house);
    assert.equal(result.evaluated, true);
    assert.equal(result.result, false);
    assert.equal(result.house, house);
    assert.equal(result.problem, null);
    assert.deepEqual(result.remedyTemples, []);
    assert.equal(result.remedy, null);
  });
}

check("House-specific Tamil effect is returned", () => {
  assert.ok(evaluate(5).problem.includes("புத்திர தோஷம்"));
  assert.ok(evaluate(10).problem.includes("தொழிலில் நிலையற்ற"));
});

check("English localization is available", () => {
  const result = evaluate(7, "en");
  assert.equal(result.status, "Mandi Dosha is present");
  assert.ok(result.problem.includes("Marital affliction"));
  assert.deepEqual(result.remedyTemples, ["Thirunaraiyur Temple", "Thiruvallangadu Temple"]);
  assert.ok(result.remedy.includes("burial"));
});

check("Missing Mandi is safely unevaluated", () => {
  const result = buildMandiDosha({ lagna: { rasiNo: 1 }, planets: [], language: "ta" });
  assert.equal(result.evaluated, false);
  assert.equal(result.result, false);
  assert.equal(result.house, null);
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);

if (fail === 0) {
  console.log("\nMANDI DOSHA BASIC UAT: PASS");
} else {
  console.log("\nMANDI DOSHA BASIC UAT: FAIL");
  process.exitCode = 1;
}
