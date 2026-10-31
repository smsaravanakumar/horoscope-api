'use strict';
const Astronomy = require('astronomy-engine');
const {normalizeDegree} = require('./astronomyService');
// Use the same approximate Lahiri formula as the existing natal engine; documented as approximation.
function ayanamsa(date) {
  const year = date.getUTCFullYear() + (date.getUTCMonth()+1)/12 + date.getUTCDate()/365.25;
  return 23.85675 + (year-2000)*0.013968;
}
function solarSidereal(date) { return normalizeDegree(Astronomy.SunPosition(date).elon - ayanamsa(date)); }
function signedDelta(value,target) { return ((value-target+540)%360)-180; }
function ingress(year, target, guessMonth) {
  let date = new Date(Date.UTC(year,guessMonth,14,6));
  for(let i=0;i<14;i++) {
    const delta = signedDelta(solarSidereal(date),target);
    date = new Date(date.getTime()-delta/0.9856*86400000);
    if(Math.abs(delta)<0.00001) break;
  }
  if(date.getUTCFullYear() < year-1 || date.getUTCFullYear() > year+1) throw new Error('Ingress failed');
  return date;
}
const WEEKDAY_PLANETS = ['sun','moon','mars','mercury','jupiter','venus','saturn'];
const TA = ['சூரியன்','சந்திரன்','செவ்வாய்','புதன்','குரு','சுக்கிரன்','சனி'];
const EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
function weekdayIST(date) { return new Date(date.getTime()+330*60000).getUTCDay(); }
// In the documented Navanayaka convention vaara runs from local sunrise to
// the next sunrise, rather than switching at civil midnight.
function sunriseReckonedWeekday(date, latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null; // No ungrounded assumption about the observing location.
  }
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  // Search starts sufficiently before the event to find the preceding sunrise.
  const start = new Date(date.getTime() - 3 * 86400000);
  let cursor = start;
  let last = null;
  for (let index = 0; index < 5; index++) {
    const found = Astronomy.SearchRiseSet('Sun', observer, +1, cursor, 3);
    if (!found || found.date.getTime() > date.getTime()) break;
    last = found.date;
    cursor = new Date(found.date.getTime() + 1000);
  }
  return last ? weekdayIST(last) : null;
}
// Chaitra Shukla Pratipada follows the new moon whose sidereal Sun is in
// Meena, immediately before Mesha Sankranti. Determine the lunar tithi at
// the LOCAL sunrise rather than from the civil date of conjunction.
// Ordinary Udayavyapini day: Pratipada at sunrise; exceptional double/missing
// sunrise cases use the earliest eligible day and are flagged for review.
function findRajaNewYear(year, latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const mesha = ingress(year, 0, 3);
  let cursor = new Date(mesha.getTime() - 65 * 86400000);
  const moons = [];
  for (let i=0;i<4;i++) {
    const phase = Astronomy.SearchMoonPhase(0, cursor, 45);
    if (!phase) break;
    if (phase.date < mesha && solarSidereal(phase.date) >= 330) moons.push(phase.date);
    cursor = new Date(phase.date.getTime() + 2*86400000);
  }
  const newMoon = moons.at(-1);
  if (!newMoon) return null;
  const first = Astronomy.SearchRiseSet('Sun', observer, +1, new Date(newMoon.getTime()-12*3600000), 4);
  if (!first) return null;
  const sunrises=[];
  let searchFrom=new Date(first.date.getTime());
  for(let i=0;i<4;i++) {
    const found=Astronomy.SearchRiseSet('Sun', observer, +1, searchFrom, 4);
    if(!found) break;
    const sunrise=found.date;
    const phase=Astronomy.MoonPhase(sunrise);
    sunrises.push({sunrise,phase,isPratipada:phase>=0 && phase<12});
    searchFrom=new Date(sunrise.getTime()+1000);
  }
  // Sunrise on which Pratipada occurs. If the tithi touches neither sunrise,
  // the first sunrise AFTER the tithi's start is a provisional fallback.
  const candidates=sunrises.filter(x=>x.isPratipada && x.sunrise>=newMoon);
  let chosen=candidates[0];
  let special='UDAYAVYAPINI';
  if (!chosen) {
    chosen=[...sunrises].reverse().find(x=>x.sunrise<=newMoon);
    special='KSHAYA_START_DAY_PROVISIONAL';
  } else if(candidates.length>1) special='VRIDDHI_FIRST_SUNRISE';
  if(!chosen) return null;
  const weekday=weekdayIST(chosen.sunrise);
  return {
    timeUtc:chosen.sunrise.toISOString(),
    newMoonTimeUtc:newMoon.toISOString(),
    weekdayIndex:weekday,planetKey:WEEKDAY_PLANETS[weekday],
    planetTa:TA[weekday],planetEn:EN[weekday],
    tithiAtSunriseDegrees:Number(chosen.phase.toFixed(5)),
    determination:special,
  };
}
function buildYear(year, latitude, longitude) {
  const events = {
    mesha: ingress(year,0,3),
    karka: ingress(year,90,6),
    simha: ingress(year,120,7),
    tula: ingress(year,180,9),
    kanya: ingress(year,150,8),
    dhanu: ingress(year,240,11),
    makara: ingress(year+1,270,0),
    ardra: ingress(year,66+40/60,5), // Ardra begins at 6°40′ Mithuna (66°40′ ecliptic sidereal)
  };
  const result = Object.fromEntries(Object.entries(events).map(([key,date])=>{
    const index=sunriseReckonedWeekday(date, latitude, longitude);
    const planetKey=index === null ? null : WEEKDAY_PLANETS[index];
    return [key,{timeUtc:date.toISOString(),weekdayIndex:index,planetKey,planetTa:index === null ? null : TA[index],planetEn:index === null ? null : EN[index]}];
  }));
  result.raja = findRajaNewYear(year,latitude,longitude);
  return result;
}
const ROLES = [
  ['raja','ராஜா','Raja','raja'],
  ['mantri','மந்திரி','Mantri','mesha'],
  ['senadhipati','சேனாதிபதி','Senadhipati','simha'],
  ['sasyadhipati','சஸ்யாதிபதி','Sasyadhipati','karka'],
  ['dhanyadhipati','தான்யாதிபதி','Dhanyadhipati','dhanu'],
  ['meghadhipati','மேகாதிபதி','Meghadhipati','ardra'],
  ['rasadhipati','ரஸாதிபதி','Rasadhipati','tula'],
  ['nirasadhipati','நீரஸாதிபதி','Nirasadhipati','makara'],
  ['dhanadhipati','தனாதிபதி','Dhanadhipati','kanya'],
];
function buildClientNavanayaka({birthDate,analysisYear=new Date().getUTCFullYear(),language='ta',latitude=null,longitude=null}) {
  const born = new Date(birthDate);
  if(Number.isNaN(born.getTime())) throw new Error('Invalid Navanayaka birth date');
  if(!Number.isInteger(analysisYear) || analysisYear<1900 || analysisYear>2200) throw new Error('Invalid Navanayaka analysis year');
  // Civil-year comparison; the local Tamil solar-year boundary should be validated before final release.
  const birthYear = born.getUTCFullYear();
  const years = [...new Set([birthYear,birthYear+1,analysisYear])];
  const lookup = Object.fromEntries(years.map(y=>[y,buildYear(y,latitude,longitude)]));
  return {
    status:'NINE_ROLES_COMPUTED_PROVISIONAL_ASTRONOMY',
    convention:'Chaitra Shukla Pratipada Raja with local sunrise tithi; eight documented solar ingress/Ardra weekday roles; approximate Lahiri ayanamsa and sunrise-reckoned weekdays',
    source:'https://www.drikpanchang.com/festivals/samvat-newyear/info/about-new-samvata-mantri-mandala.html',
    additionalReference:'https://panchangtime.com/about/mantri-mandala',
    columnYears:{birthYear,nextYear:birthYear+1,analysisYear},
    caveat:'Raja requires location; lunar tithi convention includes exceptional kshaya/vriddhi cases. Astronomical engine uses approximate Lahiri and role assignments still require independent reference-year comparison. Years are Gregorian comparisons, not Tamil year spans. Not certified for production.',
    rows:ROLES.map(([key,ta,en,event])=>({
      key,name:language==='en'?en:ta,
      ...Object.fromEntries([['birthYear',birthYear],['nextYear',birthYear+1],['analysisYear',analysisYear]].map(([column,year])=>{
        const item=event?lookup[year][event]:null;
        return [column,item?{planetKey:item.planetKey,planetName:language==='en'?item.planetEn:item.planetTa,event,eventTimeUtc:item.timeUtc,weekdayIndex:item.weekdayIndex,determination:item.determination||null,newMoonTimeUtc:item.newMoonTimeUtc||null,verification:item.weekdayIndex === null ? 'LOCATION_REQUIRED' : 'PROVISIONAL'}:{planetKey:null,planetName:null,verification:'RULE_NOT_VERIFIED'}];
      }))
    })),
  };
}
module.exports = {buildClientNavanayaka, ingress, solarSidereal, sunriseReckonedWeekday, findRajaNewYear};
