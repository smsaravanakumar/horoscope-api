const assert = require('assert');
const {
  buildClientAstroRules,
  normalizeMaritalStatus,
} = require('../services/clientAstroRuleService');

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

function planet(key, name, rasiNo, retrograde = false, longitude = rasiNo * 20) {
  return {
    key,
    name,
    rasiNo,
    retrograde,
    longitude,
  };
}

const planets = [
  planet('sun', 'சூரியன்', 5, false, 125),
  planet('moon', 'சந்திரன்', 2, false, 35),
  planet('mars', 'செவ்வாய்', 7, false, 185),
  planet('mercury', 'புதன்', 3, false, 65),
  planet('jupiter', 'குரு', 9, false, 245),
  planet('venus', 'சுக்கிரன்', 4, false, 95),
  planet('saturn', 'சனி', 6, false, 155),
  planet('rahu', 'ராகு', 11, true, 315),
  planet('ketu', 'கேது', 5, true, 135),
  planet('mandi', 'மாந்தி', 12, false, 345),
];

const dasha = {
  currentDasha: 'குரு',
  currentBhukti: 'புதன்',
};

function build({ gender = 'male', maritalStatus = 'unmarried', language = 'ta' } = {}) {
  return buildClientAstroRules({
    gender,
    maritalStatus,
    planets,
    dasha,
    language,
  });
}

test('Sun Rasi is used for Government / Politics deity', () => {
  const result = build();
  assert.strictEqual(result.governmentPoliticsDeity.rulePlanetKey, 'sun');
  assert.strictEqual(result.governmentPoliticsDeity.rasiNo, 5);
  assert.strictEqual(result.governmentPoliticsDeity.deity, 'நெல்லையப்பர்');
});

test('Mercury Rasi is used for Education deity', () => {
  const result = build();
  assert.strictEqual(result.educationDeity.rulePlanetKey, 'mercury');
  assert.strictEqual(result.educationDeity.rasiNo, 3);
  assert.strictEqual(result.educationDeity.deity, 'மகாலட்சுமி தாயார்');
});

test('Unmarried male uses Venus Rasi for Marriage deity', () => {
  const result = build({ gender: 'male', maritalStatus: 'unmarried' });
  assert.strictEqual(result.marriageDeity.rulePlanetKey, 'venus');
  assert.strictEqual(result.marriageDeity.rasiNo, 4);
  assert.strictEqual(result.marriageDeity.gender, 'male');
});

test('Unmarried female uses Mars Rasi for Marriage deity', () => {
  const result = build({ gender: 'female', maritalStatus: 'unmarried' });
  assert.strictEqual(result.marriageDeity.rulePlanetKey, 'mars');
  assert.strictEqual(result.marriageDeity.rasiNo, 7);
  assert.strictEqual(result.marriageDeity.gender, 'female');
});

test('Married male does not return Marriage deity', () => {
  const result = build({ gender: 'male', maritalStatus: 'married' });
  assert.strictEqual(result.marriageDeity, null);
});

test('Married female does not return Marriage deity', () => {
  const result = build({ gender: 'female', maritalStatus: 'married' });
  assert.strictEqual(result.marriageDeity, null);
});

test('Missing marital status does not return Marriage deity', () => {
  const result = build({ gender: 'male', maritalStatus: '' });
  assert.strictEqual(result.marriageDeity, null);
});

test('Tamil unmarried value is normalized', () => {
  assert.strictEqual(normalizeMaritalStatus('திருமணம் ஆகவில்லை'), 'unmarried');
});

test('Existing Jeevanadi deity rule remains unchanged', () => {
  const result = build({ gender: 'male' });
  assert.strictEqual(result.jeevanadiDeity.rulePlanetKey, 'jupiter');
  assert.strictEqual(result.jeevanadiDeity.rasiNo, 9);
});

test('Existing Profession deity rule remains unchanged', () => {
  const result = build();
  assert.strictEqual(result.professionDeity.rulePlanetKey, 'saturn');
  assert.strictEqual(result.professionDeity.rasiNo, 6);
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);
console.log(fail === 0 ? '\nCLIENT SPECIAL DEITY RULE UAT: PASS' : '\nCLIENT SPECIAL DEITY RULE UAT: FAIL');
process.exitCode = fail === 0 ? 0 : 1;
