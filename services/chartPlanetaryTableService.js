'use strict';
const { enrichPlanets } = require('./astrologyService');
const { buildPlanetaryTable } = require('./birthCalculationDetailsService');

// Additive display rows only. Never mutate existing chart bodies or evaluate
// physical combustion/retrograde rules from divisional longitudes for output.
function buildChartPlanetaryTable({ lagna, planets = [], language = 'ta' }) {
  language = language === 'en' ? 'en' : 'ta';
  const bodies = [lagna, ...planets].filter(Boolean);
  const valid = bodies.filter(p => typeof p.longitude === 'number' && Number.isFinite(p.longitude));
  const enriched = enrichPlanets(valid.map(p => ({
    key:p.key, ta:p.name, en:p.name, siderealLongitude:p.longitude,
  })), language);
  const rows = buildPlanetaryTable({
    lagna: enriched.find(p => p.key === 'lagna'),
    planets: enriched.filter(p => p.key !== 'lagna'), language,
  });
  return rows.map(row => {
    const original = valid.find(p => p.key === row.key);
    const degree = ((row.longitude % 30) + 30) % 30;
    const seconds = Math.floor(degree * 3600 + 1e-7);
    const d = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
    return {...row, degreeInSign:degree,
      degreeDms: {degree:d, minute:m, second:s, text:`${d}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`},
      retrograde:original.retrograde === true};
  });
}
module.exports = { buildChartPlanetaryTable };
