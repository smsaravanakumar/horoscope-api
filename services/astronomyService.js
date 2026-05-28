const Astronomy = require("astronomy-engine");

const PLANETS = [
  { key: "sun", ta: "சூரியன்", en: "Sun", body: Astronomy.Body.Sun },
  { key: "moon", ta: "சந்திரன்", en: "Moon", body: Astronomy.Body.Moon },
  { key: "mercury", ta: "புதன்", en: "Mercury", body: Astronomy.Body.Mercury },
  { key: "venus", ta: "சுக்கிரன்", en: "Venus", body: Astronomy.Body.Venus },
  { key: "mars", ta: "செவ்வாய்", en: "Mars", body: Astronomy.Body.Mars },
  { key: "jupiter", ta: "குரு", en: "Jupiter", body: Astronomy.Body.Jupiter },
  { key: "saturn", ta: "சனி", en: "Saturn", body: Astronomy.Body.Saturn },
];

function normalizeDegree(deg) {
  let value = deg % 360;
  if (value < 0) value += 360;
  return value;
}

function getLahiriAyanamsa(date) {
  const year =
    date.getUTCFullYear() +
    (date.getUTCMonth() + 1) / 12 +
    date.getUTCDate() / 365.25;

  return 23.85675 + (year - 2000) * 0.013968;
}

function getEclipticLongitude(body, date) {
  if (body === Astronomy.Body.Sun) {
    const sun = Astronomy.SunPosition(date);
    return normalizeDegree(sun.elon);
  }

  const vector = Astronomy.GeoVector(body, date, true);
  const ecliptic = Astronomy.Ecliptic(vector);
  return normalizeDegree(ecliptic.elon);
}

function getPlanetSpeed(body, date) {
  const oneDayMs = 24 * 60 * 60 * 1000;

  const prevDate = new Date(date.getTime() - oneDayMs);
  const nextDate = new Date(date.getTime() + oneDayMs);

  const prevLon = getEclipticLongitude(body, prevDate);
  const nextLon = getEclipticLongitude(body, nextDate);

  let diff = nextLon - prevLon;

  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return diff / 2;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180.0;
}

function radToDeg(rad) {
  return (rad * 180.0) / Math.PI;
}

function getJulianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function getGMST(date) {
  const jd = getJulianDay(date);
  const t = (jd - 2451545.0) / 36525.0;

  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000.0;

  return normalizeDegree(gmst);
}

/*

function getAscendantTropicalLongitude(date, latitude, longitude) {
  const gmst = getGMST(date);
  const lst = normalizeDegree(gmst + longitude);

  const epsilon = 23.4392911;

  const theta = degToRad(lst);
  const phi = degToRad(latitude);
  const eps = degToRad(epsilon);

  const numerator = -Math.cos(theta);
  const denominator =
    Math.sin(theta) * Math.cos(eps) +
    Math.tan(phi) * Math.sin(eps);

  return normalizeDegree(radToDeg(Math.atan2(numerator, denominator)));
}
*/

function getAscendantTropicalLongitude(date, latitude, longitude) {
  const gmst = getGMST(date);

  // East longitude is positive. India longitude is +77.
  const lst = normalizeDegree(gmst + longitude);

  const epsilon = 23.4392911;

  const theta = degToRad(lst);
  const phi = degToRad(latitude);
  const eps = degToRad(epsilon);

  const numerator = Math.cos(theta);
  const denominator =
    -Math.sin(theta) * Math.cos(eps) -
    Math.tan(phi) * Math.sin(eps);

  const asc = radToDeg(Math.atan2(numerator, denominator));

  return normalizeDegree(asc);
}


function getLagna(date, latitude, longitude) {
  const ayanamsa = getLahiriAyanamsa(date);

  const tropicalLongitude = getAscendantTropicalLongitude(
    date,
    latitude,
    longitude
  );

  const siderealLongitude = normalizeDegree(tropicalLongitude - ayanamsa);

  return {
    key: "lagna",
    ta: "லக்னம்",
    en: "Lagna",
    tropicalLongitude,
    siderealLongitude,
    speed: 0,
  };
}

function getMeanRahuKetu(date, ayanamsa) {
  const jd = getJulianDay(date);
  const t = (jd - 2451545.0) / 36525.0;

  const tropicalRahu = normalizeDegree(
    125.04452 -
      1934.136261 * t +
      0.0020708 * t * t +
      (t * t * t) / 450000
  );

  const tropicalKetu = normalizeDegree(tropicalRahu + 180);

  return [
    {
      key: "rahu",
      ta: "ராகு",
      en: "Rahu",
      tropicalLongitude: tropicalRahu,
      siderealLongitude: normalizeDegree(tropicalRahu - ayanamsa),
      speed: -0.05295,
    },
    {
      key: "ketu",
      ta: "கேது",
      en: "Ketu",
      tropicalLongitude: tropicalKetu,
      siderealLongitude: normalizeDegree(tropicalKetu - ayanamsa),
      speed: -0.05295,
    },
  ];
}

function getPlanetPositions(date, latitude = 0, longitude = 0) {
  const ayanamsa = getLahiriAyanamsa(date);

  const planets = PLANETS.map((planet) => {
    const tropicalLongitude = getEclipticLongitude(planet.body, date);
    const siderealLongitude = normalizeDegree(tropicalLongitude - ayanamsa);
    const speed = getPlanetSpeed(planet.body, date);

    return {
      key: planet.key,
      ta: planet.ta,
      en: planet.en,
      tropicalLongitude,
      siderealLongitude,
      speed,
    };
  });

  const nodes = getMeanRahuKetu(date, ayanamsa);
  planets.push(...nodes);

  const lagna = getLagna(date, latitude, longitude);

  return {
    ayanamsa,
    planets,
    lagna,
  };
}

module.exports = {
  getPlanetPositions,
  getLagna,
  normalizeDegree,
};