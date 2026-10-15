const assert = require('assert');
const {
  getPlanetPositions,
  getMandiPosition,
} = require('../services/astronomyService');
const { enrichPlanets } = require('../services/astrologyService');
const {
  buildBirthCalculationDetails,
} = require('../services/birthCalculationDetailsService');
const { calculateDasha } = require('../services/dashaService');

function makeReferenceDetails(language = 'ta') {
  // Client reference image supplied for 02-07-1969, 04:05 PM.
  // Coordinates are taken from the image: 11:39:00 N / 78:10:00 E.
  const birthDate = new Date('1969-07-02T16:05:00+05:30');
  const latitude = 11 + 39 / 60;
  const longitude = 78 + 10 / 60;
  const raw = getPlanetPositions(birthDate, latitude, longitude);
  const mandi = getMandiPosition(
    birthDate,
    latitude,
    longitude,
    raw.ayanamsa
  );
  if (mandi) raw.planets.push(mandi);

  const planets = enrichPlanets(raw.planets, language);
  const lagna = enrichPlanets([raw.lagna], language)[0];
  const moon = planets.find((planet) => planet.key === 'moon');
  const dasha = calculateDasha({
    moonLongitude: moon.longitude,
    birthDate,
    currentDate: new Date('2026-10-13T12:00:00+05:30'),
    language,
  });

  return buildBirthCalculationDetails({
    birthDate,
    latitude,
    longitude,
    ayanamsa: raw.ayanamsa,
    lagna,
    planets,
    dasha,
    language,
    currentDate: new Date('2026-10-13T12:00:00+05:30'),
  });
}

(function run() {
  const details = makeReferenceDetails('ta');

  assert.strictEqual(details.calculationMethod, 'thirukanitha-lahiri-additive-v1');
  assert.strictEqual(details.sunrise.timeIst, '05:57');
  assert.strictEqual(details.sunset.timeIst, '18:45');
  assert.strictEqual(details.udayadhiNazhigai.text, '25.20');

  // The supplied client page prints about 54.45. The astronomy-engine/Lahiri
  // computation should stay within a few traditional vinadi of that reference.
  assert.strictEqual(details.aadiAnthamNazhigai.nazhigai, 54);
  assert.ok(
    details.aadiAnthamNazhigai.vinadi >= 40 &&
      details.aadiAnthamNazhigai.vinadi <= 55,
    `Unexpected Aadi-Antham value: ${details.aadiAnthamNazhigai.text}`
  );

  const rows = Object.fromEntries(
    details.planetaryTable.map((row) => [row.key, row])
  );
  assert.strictEqual(rows.lagna.longitudeDms.text, '221:11:02');
  assert.strictEqual(rows.sun.longitudeDms.text, '76:55:24');
  assert.strictEqual(rows.moon.longitudeDms.text, '293:53:45');
  assert.strictEqual(rows.mars.longitudeDms.text, '218:30:11');
  assert.strictEqual(rows.mercury.longitudeDms.text, '57:03:13');
  assert.strictEqual(rows.jupiter.longitudeDms.text, '154:57:26');
  assert.strictEqual(rows.venus.longitudeDms.text, '31:52:54');
  assert.strictEqual(rows.saturn.longitudeDms.text, '13:26:41');
  assert.strictEqual(rows.mars.relationship.text, 'ஆட்சி');
  assert.strictEqual(rows.mercury.relationship.text, 'நட்பு');
  assert.strictEqual(rows.saturn.relationship.text, 'நீசம்');
  assert.strictEqual(rows.rahu.relationship.text, '---');
  assert.ok(rows.sun.nakshatraLord.name.length > 0);

  assert.ok(details.dashaTimeline.currentDasha.endDate);
  assert.ok(details.dashaTimeline.currentBhukti.endDate);
  assert.strictEqual(details.timeZone.timeCorrection, '0.00');

  const english = makeReferenceDetails('en');
  assert.strictEqual(english.planetaryTable.find((r) => r.key === 'mars').relationship.text, 'Own Sign');
  assert.strictEqual(english.ayanamsa.method, 'Lahiri');

  console.log('birthCalculationDetails.test.js: PASS');
})();
