/**
 * Bhinnashtakavarga / Sarvashtakavarga calculation engine.
 *
 * Step 5B scope:
 *   - Dynamic calculation only.
 *   - No API route integration in this step.
 *   - Uses only Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn and Lagna.
 *   - Rahu, Ketu, Mandi and other points are intentionally ignored.
 *
 * The favourable-house sets below are the traditional Parashari
 * Bhinnashtakavarga contributor rules. Each target planet receives one
 * bindu from each contributor when a sign is in one of the contributor's
 * favourable houses, counted inclusively from the contributor's natal sign.
 */

const PLANET_ORDER = Object.freeze([
  'sun',
  'moon',
  'mars',
  'mercury',
  'jupiter',
  'venus',
  'saturn',
]);

const CONTRIBUTOR_ORDER = Object.freeze([
  'sun',
  'moon',
  'mars',
  'mercury',
  'jupiter',
  'venus',
  'saturn',
  'lagna',
]);

// Traditional Parashari Bhinnashtakavarga favourable houses.
const BAV_RULES = Object.freeze({
  sun: Object.freeze({
    sun: Object.freeze([1, 2, 4, 7, 8, 9, 10, 11]),
    moon: Object.freeze([3, 6, 10, 11]),
    mars: Object.freeze([1, 2, 4, 7, 8, 9, 10, 11]),
    mercury: Object.freeze([3, 5, 6, 9, 10, 11, 12]),
    jupiter: Object.freeze([5, 6, 9, 11]),
    venus: Object.freeze([6, 7, 12]),
    saturn: Object.freeze([1, 2, 4, 7, 8, 9, 10, 11]),
    lagna: Object.freeze([3, 4, 6, 10, 11, 12]),
  }),

  moon: Object.freeze({
    sun: Object.freeze([3, 6, 7, 8, 10, 11]),
    moon: Object.freeze([1, 3, 6, 7, 10, 11]),
    mars: Object.freeze([2, 3, 5, 6, 9, 10, 11]),
    mercury: Object.freeze([1, 3, 4, 5, 7, 8, 10, 11]),
    jupiter: Object.freeze([1, 4, 7, 8, 10, 11, 12]),
    venus: Object.freeze([3, 4, 5, 7, 9, 10, 11]),
    saturn: Object.freeze([3, 5, 6, 11]),
    lagna: Object.freeze([3, 6, 10, 11]),
  }),

  mars: Object.freeze({
    sun: Object.freeze([3, 5, 6, 10, 11]),
    moon: Object.freeze([3, 6, 11]),
    mars: Object.freeze([1, 2, 4, 7, 8, 10, 11]),
    mercury: Object.freeze([3, 5, 6, 11]),
    jupiter: Object.freeze([6, 10, 11, 12]),
    venus: Object.freeze([6, 8, 11, 12]),
    saturn: Object.freeze([1, 4, 7, 8, 9, 10, 11]),
    lagna: Object.freeze([1, 3, 6, 10, 11]),
  }),

  mercury: Object.freeze({
    sun: Object.freeze([5, 6, 9, 11, 12]),
    moon: Object.freeze([2, 4, 6, 8, 10, 11]),
    mars: Object.freeze([1, 2, 4, 7, 8, 9, 10, 11]),
    mercury: Object.freeze([1, 3, 5, 6, 9, 10, 11, 12]),
    jupiter: Object.freeze([6, 8, 11, 12]),
    venus: Object.freeze([1, 2, 3, 4, 5, 8, 9, 11]),
    saturn: Object.freeze([1, 2, 4, 7, 8, 9, 10, 11]),
    lagna: Object.freeze([1, 2, 4, 6, 8, 10, 11]),
  }),

  jupiter: Object.freeze({
    sun: Object.freeze([1, 2, 3, 4, 7, 8, 9, 10, 11]),
    moon: Object.freeze([2, 5, 7, 9, 11]),
    mars: Object.freeze([1, 2, 4, 7, 8, 10, 11]),
    mercury: Object.freeze([1, 2, 4, 5, 6, 9, 10, 11]),
    jupiter: Object.freeze([1, 2, 3, 4, 7, 8, 10, 11]),
    venus: Object.freeze([2, 5, 6, 9, 10, 11]),
    saturn: Object.freeze([3, 5, 6, 12]),
    lagna: Object.freeze([1, 2, 4, 5, 6, 7, 9, 10, 11]),
  }),

  venus: Object.freeze({
    sun: Object.freeze([8, 11, 12]),
    moon: Object.freeze([1, 2, 3, 4, 5, 8, 9, 11, 12]),
    mars: Object.freeze([3, 5, 6, 9, 11, 12]),
    mercury: Object.freeze([3, 5, 6, 9, 11]),
    jupiter: Object.freeze([5, 8, 9, 10, 11]),
    venus: Object.freeze([1, 2, 3, 4, 5, 8, 9, 10, 11]),
    saturn: Object.freeze([3, 4, 5, 8, 9, 10, 11]),
    lagna: Object.freeze([1, 2, 3, 4, 5, 8, 9, 11]),
  }),

  saturn: Object.freeze({
    sun: Object.freeze([1, 2, 4, 7, 8, 10, 11]),
    moon: Object.freeze([3, 6, 11]),
    mars: Object.freeze([3, 5, 6, 10, 11, 12]),
    mercury: Object.freeze([6, 8, 9, 10, 11, 12]),
    jupiter: Object.freeze([5, 6, 11, 12]),
    venus: Object.freeze([6, 11, 12]),
    saturn: Object.freeze([3, 5, 6, 11]),
    lagna: Object.freeze([1, 3, 4, 6, 10, 11]),
  }),
});

// These are fixed classical Bhinnashtakavarga column totals and provide
// a useful internal integrity check for every horoscope.
const EXPECTED_PLANET_TOTALS = Object.freeze({
  sun: 48,
  moon: 49,
  mars: 39,
  mercury: 54,
  jupiter: 56,
  venus: 52,
  saturn: 39,
});

function normalizeDegree(value) {
  let degree = Number(value) % 360;
  if (degree < 0) degree += 360;
  return degree;
}

function getRasiNumberFromLongitude(longitude) {
  if (!Number.isFinite(Number(longitude))) {
    throw new Error('Ashtakavarga requires a valid longitude.');
  }

  return Math.floor(normalizeDegree(longitude) / 30) + 1;
}

function getRasiNumber(position, label) {
  if (!position || typeof position !== 'object') {
    throw new Error(`Ashtakavarga requires ${label}.`);
  }

  if (
    Number.isInteger(position.rasiNo) &&
    position.rasiNo >= 1 &&
    position.rasiNo <= 12
  ) {
    return position.rasiNo;
  }

  if (Number.isFinite(Number(position.longitude))) {
    return getRasiNumberFromLongitude(position.longitude);
  }

  if (Number.isFinite(Number(position.siderealLongitude))) {
    return getRasiNumberFromLongitude(position.siderealLongitude);
  }

  throw new Error(
    `Ashtakavarga requires ${label} rasiNo, longitude or siderealLongitude.`
  );
}

function getRelativeHouse(fromRasi, toRasi) {
  return ((toRasi - fromRasi + 12) % 12) + 1;
}

function buildContributorRasis({ lagna, planets }) {
  if (!Array.isArray(planets)) {
    throw new Error('Ashtakavarga requires planets array.');
  }

  const positions = new Map();
  for (const planet of planets) {
    if (
      planet &&
      typeof planet === 'object' &&
      PLANET_ORDER.includes(planet.key) &&
      !positions.has(planet.key)
    ) {
      positions.set(planet.key, planet);
    }
  }

  const contributorRasis = {
    lagna: getRasiNumber(lagna, 'lagna'),
  };

  for (const key of PLANET_ORDER) {
    const planet = positions.get(key);
    if (!planet) {
      throw new Error(`Ashtakavarga requires planet: ${key}.`);
    }
    contributorRasis[key] = getRasiNumber(planet, key);
  }

  return contributorRasis;
}

function calculateBindu({ targetPlanet, targetRasi, contributorRasis }) {
  const targetRules = BAV_RULES[targetPlanet];
  let bindu = 0;

  for (const contributor of CONTRIBUTOR_ORDER) {
    const contributorRasi = contributorRasis[contributor];
    const relativeHouse = getRelativeHouse(contributorRasi, targetRasi);

    if (targetRules[contributor].includes(relativeHouse)) {
      bindu += 1;
    }
  }

  return bindu;
}

function buildAshtakavarga({ lagna, planets }) {
  const contributorRasis = buildContributorRasis({ lagna, planets });

  const rows = [];
  const planetTotals = Object.fromEntries(
    PLANET_ORDER.map((key) => [key, 0])
  );

  for (let rasi = 1; rasi <= 12; rasi += 1) {
    const row = { rasi };
    let total = 0;

    for (const targetPlanet of PLANET_ORDER) {
      const bindu = calculateBindu({
        targetPlanet,
        targetRasi: rasi,
        contributorRasis,
      });

      row[targetPlanet] = bindu;
      planetTotals[targetPlanet] += bindu;
      total += bindu;
    }

    row.total = total;
    rows.push(row);
  }

  for (const key of PLANET_ORDER) {
    if (planetTotals[key] !== EXPECTED_PLANET_TOTALS[key]) {
      throw new Error(
        `Ashtakavarga integrity check failed for ${key}: ` +
          `expected ${EXPECTED_PLANET_TOTALS[key]}, got ${planetTotals[key]}.`
      );
    }
  }

  const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

  return {
    evaluated: true,
    type: 'bhinnashtakavarga',
    contributorOrder: [...CONTRIBUTOR_ORDER],
    planetOrder: [...PLANET_ORDER],
    contributorRasis,
    rows,
    planetTotals,
    grandTotal,
  };
}

module.exports = {
  buildAshtakavarga,
  getRasiNumberFromLongitude,
  getRelativeHouse,
  PLANET_ORDER,
  CONTRIBUTOR_ORDER,
  EXPECTED_PLANET_TOTALS,
};
