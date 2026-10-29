'use strict';
// Client temple guide data only; this module does not alter the frozen astrology engine.
const yogiData = require('../data/clientYogiAvayogiTemples.json');
const mudakkuData = require('../data/clientMudakkuHouseTemples.json');
const NAKSHATRAS_TA = ['அஸ்வினி','பரணி','கார்த்திகை','ரோகிணி','மிருகசீரிடம்','திருவாதிரை','புனர்பூசம்','பூசம்','ஆயில்யம்','மகம்','பூரம்','உத்திரம்','அஸ்தம்','சித்திரை','சுவாதி','விசாகம்','அனுஷம்','கேட்டை','மூலம்','பூராடம்','உத்திராடம்','திருவோணம்','அவிட்டம்','சதயம்','பூரட்டாதி','உத்திரட்டாதி','ரேவதி'];
const RASIS_TA = ['மேஷம்','ரிஷபம்','மிதுனம்','கடகம்','சிம்மம்','கன்னி','துலாம்','விருச்சிகம்','தனுசு','மகரம்','கும்பம்','மீனம்'];
const RASIS_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
function validIntegerInRange(value,min,max) {
  if (value===null || value===undefined || value==='') return null;
  const n=Number(value);
  return Number.isInteger(n) && n>=min && n<=max ? n : null;
}
const normalizeNakshatraNumber=v=>validIntegerInRange(v,1,27);
const normalizeHouseNumber=v=>validIntegerInRange(v,1,12);
const normalizeRasiNumber=v=>validIntegerInRange(v,1,12);
function localize(record, lang) {
  if (!record) return null;
  const original=record.ta;
  if (!original) return null;
  // Original Tamil proper nouns are retained in English responses instead of
  // inventing translated/romanized names not present in the reference PDF.
  const value=lang==='en' && record.en ? record.en : original;
  return {...value, originalLanguage:lang==='en' && !record.en ? 'ta' : lang};
}
function validateReferenceCoverage() {
  const pairs=yogiData.entries;
  const mudakku=mudakkuData.entries;
  const hasAllNakshatras=pairs.length===27 && new Set(pairs.map(e=>e.nakshatraNumber)).size===27 && pairs.every(e=>e.verified && e.yogi.ta && e.avayogi.ta);
  const hasAllRasiHouses=mudakku.length===144 && new Set(mudakku.map(e=>`${e.rasiNumber}:${e.houseNumber}`)).size===144 && mudakku.every(e=>e.verified && e.temple.ta);
  return {nakshatras: pairs.length, yogiAndAvayogiPairsComplete:hasAllNakshatras, planetaryGroups:mudakkuData.planetaryGroups, mudakkuSignHouseRows:mudakku.length, mudakkuTwelveSignsCovered:hasAllRasiHouses, sourceProofreading:'manual_client_signoff_required'};
}
function mudakkuHouseFromLagna(lagnaRasiNumber, mudakkuRasiNumber) {
  const lagna = normalizeRasiNumber(lagnaRasiNumber);
  const mudakku = normalizeRasiNumber(mudakkuRasiNumber);
  return lagna === null || mudakku === null ? null : ((mudakku - lagna + 12) % 12) + 1;
}
function resolveTempleReferences({horoscopeDetails, mudakkuHouseNumber=null, lagnaRasiNumber=null, language='ta'}={}) {
  const lang=language==='en'?'en':'ta';
  const details=horoscopeDetails||{};
  const yogiNakshatraNo=normalizeNakshatraNumber(details.yogiAvayogi?.yogi?.nakshatraNumber);
  const avayogiNakshatraNo=normalizeNakshatraNumber(details.yogiAvayogi?.avayogi?.nakshatraNumber);
  const mudakkuRasiNo=normalizeRasiNumber(details.mudakku?.rasiNumber);
  // Explicit house remains supported for existing callers. Otherwise calculate
  // inclusive house count only when *both* authoritative Rasi numbers exist.
  const explicitHouse=normalizeHouseNumber(mudakkuHouseNumber);
  const calculatedHouse=mudakkuHouseFromLagna(lagnaRasiNumber,mudakkuRasiNo);
  const houseNo=explicitHouse ?? calculatedHouse;
  const yogiRecord=yogiData.entries.find(e=>e.nakshatraNumber===yogiNakshatraNo);
  const avayogiRecord=yogiData.entries.find(e=>e.nakshatraNumber===avayogiNakshatraNo);
  const houseRecords=mudakkuRasiNo===null?[]:mudakkuData.entries.filter(e=>e.rasiNumber===mudakkuRasiNo).sort((a,b)=>a.houseNumber-b.houseNumber);
  const selected=houseNo===null?null:houseRecords.find(e=>e.houseNumber===houseNo);
  const houseOptions=houseRecords.map(e=>({houseNumber:e.houseNumber,temple:localize(e.verified ? e.temple : null,lang),sourcePage:e.sourcePage}));
  return {
    status:'reference_tables_transcribed_client_review_required',
    source:'client_supplied_reference_documents',
    approvalStatus:'temple_names_locations_and_selection_rule_pending_client_signoff',
    yogiTemple:localize(yogiRecord?.verified ? yogiRecord.yogi : null,lang),
    avayogiTemple:localize(avayogiRecord?.verified ? avayogiRecord.avayogi : null,lang),
    mudakkuHouseTemple:selected?localize(selected.verified ? selected.temple : null,lang):null,
    mudakkuHouseOptions:houseOptions,
    selection:{yogiNakshatraNo,avayogiNakshatraNo,mudakkuRasiNo,mudakkuHouseNo:houseNo,mudakkuHouseSource:explicitHouse!==null?'explicit':calculatedHouse!==null?'lagna_rasi':'unavailable'},
    labels:{nakshatra:yogiNakshatraNo!==null?NAKSHATRAS_TA[yogiNakshatraNo-1]:null,mudakkuRasi:mudakkuRasiNo!==null?(lang==='en'?RASIS_EN:RASIS_TA)[mudakkuRasiNo-1]:null},
    coverage:validateReferenceCoverage(),
    notes:lang==='en'?
      ['Proper temple and town names remain in source Tamil script until client-approved translations are supplied.', 'The selected Mudakku house is counted inclusively from natal Lagna when both Rasi values are available; the 12-house table remains as reference.', 'Transcribed values require proofreading against the source scans before production publication.']:
      ['ஆலயம் மற்றும் ஊர் பெயர்கள் மூல ஆவணத்தின் தமிழிலேயே உள்ளன.', 'லக்னத்திலிருந்து முடக்கு ராசி உள்ள பாவம் கணக்கிடப்பட்டு அந்தப் பாவக் கோவில் தேர்ந்தெடுக்கப்படுகிறது; 12 பாவப் பட்டியலும் குறிப்புக்காக உள்ளது.', 'வெளியீட்டுக்கு முன்பு மூல PDF உடன் பெயர்கள் சரிபார்க்கப்பட வேண்டும்.']
  };
}
module.exports={mudakkuHouseFromLagna,resolveTempleReferences,normalizeNakshatraNumber,normalizeHouseNumber,normalizeRasiNumber,validateReferenceCoverage};
