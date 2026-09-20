// Client-specific Pancha Pakshi mapping.
// Additive only: consumes already-calculated longitudes and does not alter
// any locked horoscope, Dasha, Yoga, Nadi, Dosha or Panchanga calculations.

const NAKSHATRA_NAMES = {
  ta: [
    'அஸ்வினி','பரணி','கிருத்திகை','ரோகிணி','மிருகசீரிஷம்','திருவாதிரை','புனர்பூசம்','பூசம்','ஆயில்யம்',
    'மகம்','பூரம்','உத்திரம்','ஹஸ்தம்','சித்திரை','சுவாதி','விசாகம்','அனுஷம்','கேட்டை','மூலம்',
    'பூராடம்','உத்திராடம்','திருவோணம்','அவிட்டம்','சதயம்','பூரட்டாதி','உத்திரட்டாதி','ரேவதி'
  ],
  en: [
    'Ashwini','Bharani','Krittika','Rohini','Mrigashirsha','Ardra','Punarvasu','Pushya','Ashlesha',
    'Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula',
    'Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'
  ]
};

const BIRDS = {
  vulture: { ta: 'வல்லூறு', en: 'Vulture' },
  owl: { ta: 'ஆந்தை', en: 'Owl' },
  crow: { ta: 'காகம்', en: 'Crow' },
  cock: { ta: 'கோழி', en: 'Cock' },
  peacock: { ta: 'மயில்', en: 'Peacock' },
};

// Client supplied table, expressed as Nakshatra number ranges.
// 1-5:   Waxing Vulture, Waning Peacock
// 6-11:  Waxing Owl,     Waning Cock
// 12-16: Waxing Crow,    Waning Crow
// 17-21: Waxing Cock,    Waning Owl
// 22-27: Waxing Peacock, Waning Vulture
const GROUPS = [
  { from: 1, to: 5, waxing: 'vulture', waning: 'peacock' },
  { from: 6, to: 11, waxing: 'owl', waning: 'cock' },
  { from: 12, to: 16, waxing: 'crow', waning: 'crow' },
  { from: 17, to: 21, waxing: 'cock', waning: 'owl' },
  { from: 22, to: 27, waxing: 'peacock', waning: 'vulture' },
];

function normalizeDegree(value) {
  let degree = Number(value) % 360;
  if (degree < 0) degree += 360;
  return degree;
}

function nakshatraNumberFromLongitude(longitude) {
  if (!Number.isFinite(Number(longitude))) return null;
  const normalized = normalizeDegree(longitude);
  return Math.floor(normalized / (360 / 27)) + 1;
}

function padaFromLongitude(longitude) {
  if (!Number.isFinite(Number(longitude))) return null;
  const normalized = normalizeDegree(longitude);
  const nakSize = 360 / 27;
  const padaSize = nakSize / 4;
  return Math.floor((normalized % nakSize) / padaSize) + 1;
}

function pakshaFromPlanets(planets) {
  const sun = Array.isArray(planets) ? planets.find((p) => p && p.key === 'sun') : null;
  const moon = Array.isArray(planets) ? planets.find((p) => p && p.key === 'moon') : null;
  if (!sun || !moon) return null;

  const elongation = normalizeDegree(Number(moon.longitude) - Number(sun.longitude));
  const tithiNumber = Math.floor(elongation / 12) + 1;
  return tithiNumber <= 15 ? 'waxing' : 'waning';
}

function birdForNakshatra(nakshatraNumber, pakshaKey) {
  const group = GROUPS.find((item) => nakshatraNumber >= item.from && nakshatraNumber <= item.to);
  if (!group || !['waxing', 'waning'].includes(pakshaKey)) return null;
  return pakshaKey === 'waxing' ? group.waxing : group.waning;
}

function buildEntry({ type, longitude, pakshaKey, language }) {
  const number = nakshatraNumberFromLongitude(longitude);
  if (!number) {
    return {
      evaluated: false,
      type,
      nakshatraNumber: null,
      nakshatra: null,
      pada: null,
      birdKey: null,
      bird: null,
    };
  }

  const birdKey = birdForNakshatra(number, pakshaKey);
  return {
    evaluated: Boolean(birdKey),
    type,
    nakshatraNumber: number,
    nakshatra: NAKSHATRA_NAMES[language][number - 1],
    pada: padaFromLongitude(longitude),
    birdKey,
    bird: birdKey ? BIRDS[birdKey][language] : null,
  };
}

function buildPanchaPakshiAnalysis({ lagna, planets, fortunePoint, language = 'ta' }) {
  const safeLanguage = language === 'en' ? 'en' : 'ta';
  const pakshaKey = pakshaFromPlanets(planets);
  const moon = Array.isArray(planets) ? planets.find((p) => p && p.key === 'moon') : null;

  const paksha = pakshaKey
    ? {
        key: pakshaKey,
        name: safeLanguage === 'ta'
          ? (pakshaKey === 'waxing' ? 'வளர்பிறை' : 'தேய்பிறை')
          : (pakshaKey === 'waxing' ? 'Waxing Moon' : 'Waning Moon'),
      }
    : { key: null, name: null };

  return {
    evaluated: Boolean(pakshaKey && lagna && moon && fortunePoint),
    paksha,
    fortuneNakshatraBird: buildEntry({
      type: 'fortune',
      longitude: fortunePoint?.longitude,
      pakshaKey,
      language: safeLanguage,
    }),
    janmaNakshatraBird: buildEntry({
      type: 'janma',
      longitude: moon?.longitude,
      pakshaKey,
      language: safeLanguage,
    }),
    lagnaNakshatraBird: buildEntry({
      type: 'lagna',
      longitude: lagna?.longitude,
      pakshaKey,
      language: safeLanguage,
    }),
    calculationMethod: 'client_nakshatra_pancha_pakshi_table',
  };
}

module.exports = {
  buildPanchaPakshiAnalysis,
  nakshatraNumberFromLongitude,
  birdForNakshatra,
  pakshaFromPlanets,
};
