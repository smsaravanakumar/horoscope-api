/**
 * Builds the current-date/current-time Gocharam (transit) chart without
 * altering any natal/birth-chart calculation.
 *
 * Production uses the same existing astronomy/astrology services as the natal
 * flow. Optional dependency injection is supported only for isolated UAT.
 */
function buildCurrentGocharam({
  date = new Date(),
  latitude,
  longitude,
  language = 'ta',
  place = '',
  _deps = null,
}) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error('Invalid Gocharam date/time.');
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Invalid Gocharam coordinates.');
  }

  const deps = _deps || (() => {
    const {
      getPlanetPositions,
      getMandiPosition,
    } = require('./astronomyService');
    const {
      enrichPlanets,
      buildSouthIndianChart,
      buildHouseChart,
    } = require('./astrologyService');
    return {
      getPlanetPositions,
      getMandiPosition,
      enrichPlanets,
      buildSouthIndianChart,
      buildHouseChart,
    };
  })();

  const raw = deps.getPlanetPositions(date, latitude, longitude);

  // Structural consistency only: reuse the already-locked Mandi calculation.
  const mandiRaw = deps.getMandiPosition(
    date,
    latitude,
    longitude,
    raw.ayanamsa
  );

  if (mandiRaw) raw.planets.push(mandiRaw);

  const planets = deps.enrichPlanets(raw.planets, language);
  const lagna = deps.enrichPlanets([raw.lagna], language)[0];

  return {
    evaluated: true,
    type: 'current_gocharam',
    dateTimeUtc: date.toISOString(),
    timeZone: 'Asia/Kolkata',
    referencePlace: place || '',
    coordinates: { latitude, longitude },
    ayanamsa: raw.ayanamsa,
    lagna,
    planets,
    chart: deps.buildSouthIndianChart({ lagna, planets }),
    houseChart: deps.buildHouseChart({ lagna, planets }),
  };
}

module.exports = { buildCurrentGocharam };
