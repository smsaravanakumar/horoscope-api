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

function getAscendantTropicalLongitude(date, latitude, longitude) {
  const gmst = getGMST(date);
  const lst = normalizeDegree(gmst + longitude);

  const epsilon = 23.4392911;

  const theta = degToRad(lst);
  const phi = degToRad(latitude);
  const eps = degToRad(epsilon);

  const numerator = -Math.cos(theta);
  const denominator =
    Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);

  // atan2 returns the opposite intersection of the ecliptic and horizon
  // for this formula. Adding 180° selects the eastern intersection,
  // which is the actual ascendant (Lagna).
  const asc = radToDeg(Math.atan2(numerator, denominator)) + 180;

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

// Traditional Maandhi calculation used by the supplied reference charts.
//
// The daylight or night-time duration is divided into eight equal portions.
// The arrays below identify the END of Saturn's portion for each weekday
// (Sunday = index 0 ... Saturday = index 6).
//
// Earlier code used the midpoint of Saturn's portion (6.5, 5.5, ...),
// which produced Leo 16°24′ for the 04-04-1971 Tirunelveli sample.
// The supplied reference uses the end-point method and expects about
// Leo 26°13′ for Maandhi.
const DAY_MANDI_END_PARTS = [7, 6, 5, 4, 3, 2, 1];
const NIGHT_MANDI_END_PARTS = [3, 2, 1, 7, 6, 5, 4];

function searchRiseSetEvents(body, observer, direction, startDate, count = 3) {
  const events = [];
  let cursor = new Date(startDate.getTime());

  for (let index = 0; index < count; index += 1) {
    const event = Astronomy.SearchRiseSet(
      body,
      observer,
      direction,
      cursor,
      3
    );

    if (!event || !event.date) break;

    events.push(event.date);
    cursor = new Date(event.date.getTime() + 60 * 1000);
  }

  return events;
}

function getIndiaWeekday(date) {
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  return new Date(date.getTime() + istOffsetMs).getUTCDay();
}

function getMandiPosition(date, latitude, longitude, ayanamsa) {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const searchStart = new Date(date.getTime() - 36 * 60 * 60 * 1000);

  // astronomy-engine uses +1 for rise and -1 for set.
  // Astronomy.Direction does not exist in the installed JavaScript package.
  const sunrises = searchRiseSetEvents(
    Astronomy.Body.Sun,
    observer,
    +1,
    searchStart,
    4
  );

  const sunsets = searchRiseSetEvents(
    Astronomy.Body.Sun,
    observer,
    -1,
    searchStart,
    4
  );

  if (sunrises.length === 0 || sunsets.length === 0) return null;

  const birthMs = date.getTime();
  const previousSunrise = [...sunrises]
    .reverse()
    .find((item) => item.getTime() <= birthMs);
  const nextSunrise = sunrises.find((item) => item.getTime() > birthMs);
  const previousSunset = [...sunsets]
    .reverse()
    .find((item) => item.getTime() <= birthMs);
  const nextSunset = sunsets.find((item) => item.getTime() > birthMs);

  let targetRiseTimeMs;
  const weekday = getIndiaWeekday(date);

  const isDayBirth =
    previousSunrise &&
    nextSunset &&
    previousSunrise.getTime() <= birthMs &&
    birthMs < nextSunset.getTime() &&
    (!previousSunset || previousSunrise.getTime() > previousSunset.getTime());

  if (isDayBirth) {
    const sunriseMs = previousSunrise.getTime();
    const sunsetMs = nextSunset.getTime();
    const dayDurationMs = sunsetMs - sunriseMs;
    const part = DAY_MANDI_END_PARTS[weekday];
    targetRiseTimeMs = sunriseMs + (part / 8) * dayDurationMs;
  } else {
    if (!previousSunset || !nextSunrise) return null;

    const sunsetMs = previousSunset.getTime();
    const sunriseMs = nextSunrise.getTime();
    const nightDurationMs = sunriseMs - sunsetMs;
    const part = NIGHT_MANDI_END_PARTS[weekday];
    targetRiseTimeMs = sunsetMs + (part / 8) * nightDurationMs;
  }

  const mandiRiseDate = new Date(targetRiseTimeMs);
  const tropicalMandi = getAscendantTropicalLongitude(
    mandiRiseDate,
    latitude,
    longitude
  );
  const siderealMandi = normalizeDegree(tropicalMandi - ayanamsa);

  return {
    key: "mandi",
    ta: "மாந்தி",
    en: "Mandi",
    tropicalLongitude: tropicalMandi,
    siderealLongitude: siderealMandi,
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
  getMandiPosition,
  normalizeDegree,
};