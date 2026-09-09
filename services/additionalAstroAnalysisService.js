const { enrichPlanets } = require('./astrologyService');

const DASHA_LORD_TO_KEY = {
  ta: {
    'கேது': 'ketu',
    'சுக்கிரன்': 'venus',
    'சூரியன்': 'sun',
    'சந்திரன்': 'moon',
    'செவ்வாய்': 'mars',
    'ராகு': 'rahu',
    'குரு': 'jupiter',
    'சனி': 'saturn',
    'புதன்': 'mercury',
  },
  en: {
    Ketu: 'ketu',
    Venus: 'venus',
    Sun: 'sun',
    Moon: 'moon',
    Mars: 'mars',
    Rahu: 'rahu',
    Jupiter: 'jupiter',
    Saturn: 'saturn',
    Mercury: 'mercury',
  },
};

function normalizeDegree(value) {
  let degree = Number(value) % 360;
  if (degree < 0) degree += 360;
  return degree;
}

function getHouseFromLagna(lagnaRasiNo, planetRasiNo) {
  let house = planetRasiNo - lagnaRasiNo + 1;
  while (house <= 0) house += 12;
  return house;
}

function calculatePartOfFortune({ lagna, planets, language = 'ta' }) {
  const sun = planets.find((planet) => planet.key === 'sun');
  const moon = planets.find((planet) => planet.key === 'moon');

  if (!lagna || !sun || !moon) return null;

  // Traditional sect-aware Part of Fortune convention:
  // Day chart   = Ascendant + Moon - Sun
  // Night chart = Ascendant + Sun - Moon
  // The existing app uses whole-sign house relationships; Sun in houses 7-12
  // is treated as a day chart, otherwise as a night chart.
  const sunHouse = getHouseFromLagna(lagna.rasiNo, sun.rasiNo);
  const isDayChart = sunHouse >= 7 && sunHouse <= 12;

  const longitude = normalizeDegree(
    isDayChart
      ? lagna.longitude + moon.longitude - sun.longitude
      : lagna.longitude + sun.longitude - moon.longitude
  );

  const enriched = enrichPlanets(
    [
      {
        key: 'fortune',
        ta: 'அரேபிய புள்ளி பார்ச்சுனர்',
        en: 'Arabic Part of Fortune',
        siderealLongitude: longitude,
        speed: 0,
      },
    ],
    language
  )[0];

  return {
    name: language === 'ta' ? 'அரேபிய புள்ளி பார்ச்சுனர்' : 'Arabic Part of Fortune',
    longitude,
    rasi: enriched.rasi,
    rasiNo: enriched.rasiNo,
    degreeMinute: enriched.degreeMinute,
    degreeMinuteText: enriched.degreeMinuteText,
    nakshatra: enriched.nakshatra,
    pada: enriched.pada,
    chartType: isDayChart
      ? language === 'ta'
        ? 'பகல் ஜாதகம்'
        : 'Day chart'
      : language === 'ta'
      ? 'இரவு ஜாதகம்'
      : 'Night chart',
    formula: isDayChart ? 'ASC + Moon - Sun' : 'ASC + Sun - Moon',
    method: 'traditional_sect_aware',
  };
}

function getDashaLordDetails({ lordName, planets, language = 'ta' }) {
  const key = DASHA_LORD_TO_KEY[language]?.[lordName];
  const planet = key ? planets.find((item) => item.key === key) : null;

  if (!planet) {
    return {
      planet: lordName || null,
      key: key || null,
      nakshatra: null,
      pada: null,
      rasi: null,
    };
  }

  return {
    planet: planet.name,
    key: planet.key,
    nakshatra: planet.nakshatra,
    pada: planet.pada,
    rasi: planet.rasi,
    degreeMinute: planet.degreeMinute,
  };
}

function getDoshaStatus({ doshas, key, language = 'ta' }) {
  const match = Array.isArray(doshas)
    ? doshas.find((dosha) => dosha && dosha.key === key)
    : null;

  return {
    result: Boolean(match),
    status: match
      ? language === 'ta'
        ? 'உள்ளது'
        : 'Present'
      : language === 'ta'
      ? 'இல்லை'
      : 'Not present',
    ...(match || {}),
  };
}

function buildAdditionalAstroAnalysis({
  lagna,
  planets,
  dasha,
  doshas,
  yogas,
  language = 'ta',
}) {
  return {
    fortunePoint: calculatePartOfFortune({ lagna, planets, language }),
    dashaLord: getDashaLordDetails({
      lordName: dasha?.currentDasha,
      planets,
      language,
    }),
    bhuktiLord: getDashaLordDetails({
      lordName: dasha?.currentBhukti,
      planets,
      language,
    }),
    kalaSarpaDosha: getDoshaStatus({
      doshas,
      key: 'kala_sarpa_dosha',
      language,
    }),
    sevvaiDosha: getDoshaStatus({
      doshas,
      key: 'sevvai_dosham',
      language,
    }),
    detectedYogas: Array.isArray(yogas)
      ? yogas
          .filter(
            (item) =>
              item &&
              item.result === true &&
              !String(item.key || '').endsWith('_neecha') &&
              item.key !== 'rahu_ketu_axis'
          )
          .map((item) => ({ key: item.key, name: item.name }))
      : [],
  };
}

module.exports = {
  buildAdditionalAstroAnalysis,
  calculatePartOfFortune,
};
