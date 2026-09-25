const assert = require('assert');

const {
  buildAshtakavarga,
  getRelativeHouse,
  EXPECTED_PLANET_TOTALS,
} = require('../services/ashtakavargaService');

const clientReference = require('../data/ashtakavargaClientReference.json');

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

function longitudeForRasi(rasiNo, degree = 15) {
  return (rasiNo - 1) * 30 + degree;
}

function planet(key, rasiNo) {
  return {
    key,
    longitude: longitudeForRasi(rasiNo),
    rasiNo,
  };
}

// Client reference Rasi placements for 04-04-1971, 07:52 AM,
// Kanniyakumari. Ashtakavarga depends on sign placement, not the exact
// degree inside a sign.
function clientReferencePositions() {
  return {
    lagna: {
      key: 'lagna',
      longitude: longitudeForRasi(1),
      rasiNo: 1,
    },
    planets: [
      planet('sun', 12),
      planet('moon', 4),
      planet('mars', 9),
      planet('mercury', 1),
      planet('jupiter', 8),
      planet('venus', 11),
      planet('saturn', 1),
      // These must not influence Ashtakavarga.
      planet('rahu', 11),
      planet('ketu', 5),
      planet('mandi', 7),
    ],
  };
}

function rotateRasi(rasiNo, amount) {
  return (((rasiNo - 1 + amount) % 12) + 12) % 12 + 1;
}

test('Relative-house calculation uses inclusive sign counting', () => {
  assert.strictEqual(getRelativeHouse(1, 1), 1);
  assert.strictEqual(getRelativeHouse(1, 7), 7);
  assert.strictEqual(getRelativeHouse(12, 1), 2);
  assert.strictEqual(getRelativeHouse(5, 4), 12);
});

test('Client Ashtakavarga reference matrix matches all 12 rows exactly', () => {
  const result = buildAshtakavarga(clientReferencePositions());

  assert.deepStrictEqual(result.rows, clientReference.rows);
  assert.deepStrictEqual(result.planetTotals, clientReference.checksums.planetTotals);
  assert.strictEqual(result.grandTotal, clientReference.checksums.grandTotal);
});

test('Classical Bhinnashtakavarga planet totals remain invariant', () => {
  const result = buildAshtakavarga(clientReferencePositions());
  assert.deepStrictEqual(result.planetTotals, EXPECTED_PLANET_TOTALS);
  assert.strictEqual(result.grandTotal, 337);
});

test('Engine is dynamic: rotating every natal position rotates the rows', () => {
  const originalInput = clientReferencePositions();
  const original = buildAshtakavarga(originalInput);

  const shift = 1;
  const rotatedInput = {
    lagna: {
      ...originalInput.lagna,
      rasiNo: rotateRasi(originalInput.lagna.rasiNo, shift),
      longitude: longitudeForRasi(
        rotateRasi(originalInput.lagna.rasiNo, shift)
      ),
    },
    planets: originalInput.planets.map((item) => ({
      ...item,
      rasiNo: rotateRasi(item.rasiNo, shift),
      longitude: longitudeForRasi(rotateRasi(item.rasiNo, shift)),
    })),
  };

  const rotated = buildAshtakavarga(rotatedInput);

  for (let rasi = 1; rasi <= 12; rasi += 1) {
    const sourceRasi = rotateRasi(rasi, -shift);
    assert.deepStrictEqual(
      rotated.rows[rasi - 1],
      {
        ...original.rows[sourceRasi - 1],
        rasi,
      }
    );
  }
});

test('Rahu, Ketu and Mandi are ignored by the calculation', () => {
  const withExtraPoints = clientReferencePositions();
  const withoutExtraPoints = {
    lagna: withExtraPoints.lagna,
    planets: withExtraPoints.planets.filter((item) =>
      ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'].includes(
        item.key
      )
    ),
  };

  assert.deepStrictEqual(
    buildAshtakavarga(withExtraPoints),
    buildAshtakavarga(withoutExtraPoints)
  );
});

test('Missing required planet is rejected instead of inventing data', () => {
  const input = clientReferencePositions();
  input.planets = input.planets.filter((item) => item.key !== 'saturn');

  assert.throws(
    () => buildAshtakavarga(input),
    /requires planet: saturn/
  );
});

console.log(`\nAshtakavarga Step 5B: ${pass} PASS / ${fail} FAIL`);

if (fail > 0) {
  process.exitCode = 1;
}
