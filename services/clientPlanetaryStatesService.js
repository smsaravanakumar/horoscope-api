'use strict';
const { getPlanetSpeedByKey } = require('./astronomyService');
const SIGN_LORDS = ['mars','venus','mercury','moon','sun','mercury','venus','mars','jupiter','saturn','saturn','jupiter'];
const STAR_LORDS = ['ketu','venus','sun','moon','mars','rahu','jupiter','saturn','mercury'];
const CLASSICAL = ['sun','moon','mars','mercury','jupiter','venus','saturn'];
const MOVING = ['mercury','venus','mars','jupiter','saturn'];
const DAY = 86400000;
function starLord(p) {
  return Number.isFinite(p.longitude) ? STAR_LORDS[Math.floor(((p.longitude % 360 + 360) % 360)/(360/27)) % 9] : null;
}
function exchanges(planets, lordOf) {
  const result = [];
  for (let i=0;i<planets.length;i++) for (let j=i+1;j<planets.length;j++) {
    const a=planets[i], b=planets[j];
    if (lordOf(a)===b.key && lordOf(b)===a.key) result.push({planetKeys:[a.key,b.key],planetNames:[a.name,b.name]});
  }
  return result;
}
function dateText(ms) {
  const d=new Date(ms+330*60000); return `${String(d.getUTCDate()).padStart(2,'0')}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${d.getUTCFullYear()}`;
}
function findStation(key, at, direction, speed=getPlanetSpeedByKey) {
  let inside=at.getTime();
  for(let i=1;i<=400;i++) {
    const outside=at.getTime()+direction*i*DAY;
    if(speed(key,new Date(outside))>=0) {
      let a=inside,b=outside;
      while(Math.abs(a-b)>60000) { const mid=(a+b)/2; if(speed(key,new Date(mid))<0) a=mid; else b=mid; }
      return new Date((a+b)/2);
    }
    inside=outside;
  }
  return null;
}
function buildPlanetaryStates({planets, date, speed=getPlanetSpeedByKey}) {
  const all=planets.filter(p=>CLASSICAL.includes(p.key)||['rahu','ketu'].includes(p.key));
  const classical=all.filter(p=>CLASSICAL.includes(p.key));
  const retrogradePeriods=classical.filter(p=>MOVING.includes(p.key)).map(p=>{
    const retrograde=speed(p.key,date)<0;
    const start=retrograde?findStation(p.key,date,-1,speed):null;
    const end=retrograde?findStation(p.key,date,1,speed):null;
    return {planetKey:p.key,planetName:p.name,retrograde,startDate:start?dateText(start.getTime()):null,endDate:end?dateText(end.getTime()):null,startIsoUtc:start?.toISOString()??null,endIsoUtc:end?.toISOString()??null};
  });
  return {referenceIsoUtc:date.toISOString(),combustPlanets:classical.filter(p=>p.combust===true).map(p=>({planetKey:p.key,planetName:p.name})),signExchanges:exchanges(classical,p=>SIGN_LORDS[p.rasiNo-1]),nakshatraExchanges:exchanges(all,starLord),retrogradePeriods,retrogradeMethod:'existing_geocentric_speed_zero_crossing_IST',excludedRetrogradeKeys:['sun','moon','rahu','ketu','mandi','lagna']};
}
module.exports={buildPlanetaryStates,findStation};
