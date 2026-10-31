'use strict';
const reference = require('../data/clientAmirthuBhagaMatrix.json');
const EN_NAMES = {sun:'Sun',moon:'Moon',mars:'Mars',mercury:'Mercury',jupiter:'Jupiter',venus:'Venus',saturn:'Saturn',rahu:'Rahu',ketu:'Ketu',lagna:'Lagna'};
function validateReference() {
  if (reference.rows.length !== 10 || reference.signsTa.length !== 12) throw new Error('Invalid Amirthu reference dimensions');
  const keys = new Set();
  for (const row of reference.rows) {
    if(keys.has(row.key) || row.degrees.length !== 12 || row.degrees.some(d => !Number.isInteger(d) || d < 0 || d > 30)) throw new Error('Invalid Amirthu reference row: '+row.key);
    keys.add(row.key);
  }
}
validateReference();
function formatDegreeMinute(value) {
  if (!Number.isFinite(value)) return null;
  let totalMinutes = Math.round(Math.abs(value) * 60);
  return `${Math.floor(totalMinutes / 60)}°${String(totalMinutes % 60).padStart(2,'0')}′`;
}
function buildClientAmirthuBhaga({lagna, planets, language='ta'}) {
  const bodies = new Map([...planets,lagna].map(p=>[p.key,p]));
  const rows = reference.rows.map(row=>{
    const body = bodies.get(row.key);
    const signNo = body?.rasiNo;
    const referenceDegree = Number.isInteger(signNo) && signNo >= 1 && signNo <= 12 ? row.degrees[signNo-1] : null;
    return {
      key: row.key, name: language === 'en' ? EN_NAMES[row.key] : row.ta,
      rasiNo: referenceDegree === null ? null : signNo,
      rasi: referenceDegree === null ? null : body.rasi,
      actualDegreeInSign: referenceDegree === null ? null : body.degreeInRasi,
      amirthuDegree: referenceDegree,
      deviationDegrees: referenceDegree === null || !Number.isFinite(body.degreeInRasi) ? null : Number(Math.abs(body.degreeInRasi-referenceDegree).toFixed(5)),
      actualDegreeDms: referenceDegree === null ? null : formatDegreeMinute(body.degreeInRasi),
      referenceDegreeDms: formatDegreeMinute(referenceDegree),
      deviationDms: referenceDegree === null || !Number.isFinite(body.degreeInRasi) ? null : formatDegreeMinute(Math.abs(body.degreeInRasi-referenceDegree)),
      classification: 'UNVERIFIED',
      classificationTa: 'விதி உறுதிப்படுத்தப்படவில்லை',
      classificationEn: 'Rule not verified',
    };
  });
  return {
    status: 'REFERENCE_LOOKUP_READY_CLASSIFICATION_UNVERIFIED',
    source: reference.source,
    chart: 'D1',
    ruleNote: language === 'ta'
      ? 'விளக்கப்படத்தில் அமிர்த்து பாகை எண்கள் மட்டுமே உள்ளன. சுபம்/அசுபம் வகைப்படுத்தும் துல்லியமான விதி உறுதி செய்யப்படவில்லை.'
      : 'The reference supplies degrees but not a verified rule mapping actual degrees to Subam/Asubam.',
    signsTa: reference.signsTa,
    referenceMatrix: reference.rows.map(r=>({key:r.key,name:language==='en'?EN_NAMES[r.key]:r.ta,degrees:[...r.degrees]})),
    personalizedRows: rows,
  };
}
module.exports = {buildClientAmirthuBhaga, validateReference, formatDegreeMinute};
