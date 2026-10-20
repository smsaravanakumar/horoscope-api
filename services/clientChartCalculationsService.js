'use strict';

// Additive outputs only: frozen chart, navamsaChart and D1-D60 analysis stay intact.
// References and exact conventions: API_CHART_CALCULATIONS.md.
const { buildChartPlanetaryTable } = require('./chartPlanetaryTableService');
const { getNavamsaRasiNumber } = require('./d1D60AnalysisService');
const SIGNS = {
  en: ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'],
  ta: ['மேஷம்','ரிஷபம்','மிதுனம்','கடகம்','சிம்மம்','கன்னி','துலாம்','விருச்சிகம்','தனுசு','மகரம்','கும்பம்','மீனம்'],
};
const SEVEN = Object.freeze(['sun','moon','mars','mercury','jupiter','venus','saturn']);
const SHOONYA = Object.freeze([
  [], [7,10], [9,12], [5,10], [2,11], [3,6], [1,5], [4,9],
  [3,6], [5,8], [5,8], [9,12], [7,10], [2,5], [3,6,9,12], [],
]);
function normalized(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError('Finite numeric longitude required');
  return ((value % 360) + 360) % 360;
}
function dms(degrees) {
  // Truncate display seconds so 29:59:59 never displays a false 30-degree sign.
  const total = Math.floor(degrees * 3600 + 1e-7);
  const degree = Math.floor(total / 3600);
  const minute = Math.floor(total % 3600 / 60);
  const second = total % 60;
  return { degree, minute, second,
    text: `${degree}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}` };
}
function position(body, division, language) {
  const natalLongitude = normalized(body.longitude);
  const natalDegreeInSign = natalLongitude % 30;
  const natalSignIndex = Math.floor(natalLongitude / 30);
  let rasiNo, degreeInSign;
  if (division === 9) {
    rasiNo = getNavamsaRasiNumber(natalLongitude);
    degreeInSign = (natalLongitude * 9) % 30;
  } else if (division === 60) {
    // Astro-Vision published method: count 0.5-degree segments from natal sign.
    const segment = Math.floor(natalDegreeInSign * 2);
    rasiNo = (natalSignIndex + segment) % 12 + 1;
    degreeInSign = (natalDegreeInSign * 2 - segment) * 30;
  } else throw new RangeError('Only D9 and D60 are supported');
  return { key: body.key, name: body.name, natalLongitude,
    natalDegreeInSign, natalDegreeDms: dms(natalDegreeInSign),
    longitude: (rasiNo - 1) * 30 + degreeInSign,
    rasiNo, rasi: SIGNS[language][rasiNo - 1], degreeInSign,
    degreeDms: dms(degreeInSign), retrograde: body.retrograde === true,
    ...(division === 60 ? { divisionNumber: Math.floor(natalDegreeInSign * 2) + 1 } : {}),
  };
}
function chart(lagna, planets) {
  const result = Object.fromEntries(Array.from({length:12}, (_,i) => [String(i+1), []]));
  for (const body of [lagna, ...planets]) result[body.rasiNo].push(body);
  return result;
}
function buildThithiSoonya(tithi, language = 'ta') {
  const number = tithi?.number;
  if (!Number.isInteger(number) || number < 1 || number > 30) {
    return { evaluated:false, reason:'valid_birth_tithi_required', rasiNumbers:[], rasis:[] };
  }
  const pakshaNumber = (number - 1) % 15 + 1;
  const rasiNumbers = [...SHOONYA[pakshaNumber]];
  return { evaluated:true, tithiNumber:number, pakshaNumber, tithiName:tithi.name,
    calculationMethod:'dagdha_rasi_common_table_both_pakshas',
    chaturdashiConvention:'all_four_signs',
    rasiNumbers, rasis:rasiNumbers.map(rasiNo => ({ rasiNo, rasi:SIGNS[language][rasiNo-1] })),
  };
}
function referenceLagna(navamsaPlanets, basis, language) {
  const field = basis === 'natal' ? 'natalDegreeInSign' : 'degreeInSign';
  const eligible = navamsaPlanets.filter(p => SEVEN.includes(p.key));
  const common = { calculationMethod:basis === 'natal'
      ? 'highest_natal_sign_degree_planet_in_D9' : 'client_highest_D9_sign_degree',
    eligiblePlanetKeys:[...SEVEN], excludedPlanetKeys:['rahu','ketu','mandi','gulika','lagna'],
    degreeBasis:field, chartBasis:'D9_planet_positions', ordinaryNavamsaLagnaUnchanged:true };
  if (new Set(eligible.map(p=>p.key)).size !== 7 || eligible.length !== 7) {
    return {...common, evaluated:false, reason:'seven_classical_planets_required'};
  }
  const highest = Math.max(...eligible.map(p=>p[field]));
  const candidates = eligible.filter(p => Math.abs(p[field]-highest) < 1e-9);
  // Do not pick by input ordering when equal full-precision degrees disagree.
  if (candidates.length !== 1) return {...common, evaluated:false,
    reason:'equal_degree_tie_requires_rule', candidatePlanetKeys:candidates.map(p=>p.key)};
  const selected = candidates[0];
  return {...common, evaluated:true, selectedPlanetKey:selected.key,
    selectedPlanet:selected.name, selectedDegree:highest, selectedDegreeDms:dms(highest),
    lagna:{rasiNo:selected.rasiNo, rasi:SIGNS[language][selected.rasiNo-1]},
    planets:navamsaPlanets.map(p=>({...p, houseFromReferenceLagna:(p.rasiNo-selected.rasiNo+12)%12+1})),
  };
}
function buildClientChartCalculations({lagna, planets, horoscopeDetails, language = 'ta'}) {
  language = language === 'en' ? 'en' : 'ta';
  const d9Lagna = position({...lagna,key:'lagna'},9,language);
  const d9Planets = planets.map(p=>position(p,9,language));
  const d60Lagna = position({...lagna,key:'lagna'},60,language);
  const d60Planets = planets.map(p=>position(p,60,language));
  const thithiSoonyaRasi = buildThithiSoonya(horoscopeDetails?.tithi,language);
  const markers = Object.fromEntries(Array.from({length:12},(_,i)=>[String(i+1),[]]));
  function add(rasiNo, type, color, planetKey) {
    if (!Number.isInteger(rasiNo) || rasiNo < 1 || rasiNo > 12) return;
    markers[rasiNo].push({type,color,...(planetKey ? {planetKey} : {})});
  }
  for (const rasiNo of thithiSoonyaRasi.rasiNumbers) add(rasiNo,'thithiSoonya','#FFCDD2');
  add(horoscopeDetails?.mudakku?.rasiNumber,'mudakku','#8B1E24');
  for (const [type,color] of [['avayogi','#8B1E24'],['yogi','#145A32']]) {
    const key = horoscopeDetails?.yogiAvayogi?.[type]?.planetKey;
    const planet = planets.find(p=>p.key === key);
    if (planet) add(planet.rasiNo,type,color,key);
  }
  return {
    schemaVersion:1,
    navamsaDetails:{division:9,calculationMethod:'existing_Parashara_D9_signs',
      degreeBasis:'transformed_D9_degrees_within_sign', lagna:d9Lagna, planets:d9Planets,
      chart:chart(d9Lagna,d9Planets),
      planetaryTable:buildChartPlanetaryTable({lagna:d9Lagna,planets:d9Planets,language})},
    shashtiamsa:{division:60,calculationMethod:'half_degree_count_from_natal_sign',
      source:'https://blog.indianastrologysoftware.com/sashtiamsa-d60/',
      validation:'published_AstroVision_sample_sign_positions_tested',
      legacyD1D60Unchanged:true, lagna:d60Lagna,planets:d60Planets,chart:chart(d60Lagna,d60Planets),
      planetaryTable:buildChartPlanetaryTable({lagna:d60Lagna,planets:d60Planets,language})},
    karakamsa:{...referenceLagna(d9Planets,'d9',language),
      planetaryTable:buildChartPlanetaryTable({planets:d9Planets,language}),
      label:language === 'ta' ? 'D9 அதிக பாகை அடிப்படையிலான லக்னம் (வாடிக்கையாளர் விதி)' : 'Highest D9 degree reference Lagna (client rule)',
      astroVisionEquivalence:'not_claimed_custom_client_rule'},
    traditionalKarakamsa:referenceLagna(d9Planets,'natal',language),
    thithiSoonyaRasi,
    // Reuse original calculations; no new Yogi/Mudakku astronomy or rules.
    mudakkuRasi:horoscopeDetails?.mudakku ?? null,
    yogiAvayogi:horoscopeDetails?.yogiAvayogi ?? null,
    rasiChartIndicators:{basis:'natal_Rasi',yogiAvayogiBasis:'occupied_sign_of_API_designated_planet',signs:markers},
  };
}
module.exports = {buildClientChartCalculations,buildThithiSoonya,position,referenceLagna};
