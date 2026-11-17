'use strict';

const { buildDashaTimeline } = require('./birthCalculationDetailsService');

// Client convention: use the *transit* Moon's sidereal Nakshatra and its
// traversed fraction as the seed of a birth-anchored Vimshottari timeline.
// Evaluate that timeline at the exact same instant as the transit chart.
// This is independent of the frozen natal Moon timeline.
function buildClientGocharamDasha({ birthDate, currentGocharam, language = 'ta' }) {
  const birthMs = birthDate instanceof Date ? birthDate.getTime() : NaN;
  const referenceMs = Date.parse(currentGocharam?.dateTimeUtc);
  const moon = currentGocharam?.planets?.find(p => p.key === 'moon');
  if (!Number.isFinite(birthMs) || !Number.isFinite(referenceMs) || referenceMs < birthMs ||
      currentGocharam?.evaluated !== true || !Number.isFinite(moon?.longitude)) {
    return { evaluated: false, reason: 'invalid_gocharam_dasha_inputs' };
  }
  const longitude = ((moon.longitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(longitude / (360 / 27));
  const progressFraction = (longitude - nakshatraIndex * (360 / 27)) / (360 / 27);
  // Retain the existing 365.25-day year and subperiod order. The birthDasha
  // label from the reusable routine is deliberately not returned as natal data.
  const timeline = buildDashaTimeline({ birthDate, moon: { longitude },
    language, currentDate: new Date(referenceMs) });
  return {
    evaluated: true,
    calculationMethod: timeline.calculationMethod,
    convention: 'birth_anchored_transit_moon_nakshatra_fraction',
    referenceIsoUtc: new Date(referenceMs).toISOString(),
    birthAnchorIsoUtc: birthDate.toISOString(),
    cycleYears: 120,
    referenceMoon: {
      longitude, nakshatra: moon.nakshatra ?? null, nakshatraIndex: nakshatraIndex + 1,
      pada: moon.pada ?? null, progressFraction,
      seedLordKey: timeline.birthDasha.key, seedLordName: timeline.birthDasha.name,
    },
    currentDasha: timeline.currentDasha,
    currentBhukti: timeline.currentBhukti,
    currentAntaram: timeline.currentAntaram,
  };
}

module.exports = { buildClientGocharamDasha };
