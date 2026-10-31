const test = require('node:test');
const assert = require('node:assert/strict');
const {buildClientNavanayaka,ingress,solarSidereal} = require('../services/clientNavanayakaService');
const {buildClientAmirthuBhaga} = require('../services/clientAmirthuBhagaService');
test('Client Amirthu matrix has 120 validated cells and exact known samples',()=>{
 const r=buildClientAmirthuBhaga({lagna:{key:'lagna',rasiNo:1,rasi:'மேஷம்',degreeInRasi:11.1},planets:[{key:'sun',rasiNo:1,rasi:'மேஷம்',degreeInRasi:20.2}]});
 assert.equal(r.referenceMatrix.length,10);
 assert.equal(r.referenceMatrix.flatMap(x=>x.degrees).length,120);
 assert.deepEqual(r.referenceMatrix[0].degrees,[20,9,12,6,8,24,16,17,22,2,3,23]);
 assert.deepEqual(r.referenceMatrix[9].degrees,[1,9,22,22,25,2,4,23,18,20,24,10]);
 assert.equal(r.personalizedRows[0].amirthuDegree,20);
 assert.equal(r.personalizedRows[0].classification,'UNVERIFIED');
 assert.equal(r.personalizedRows[9].amirthuDegree,1);
});
test('Navanayaka returns nine roles and 3 annual comparison fields without invented Raja',()=>{
 const r=buildClientNavanayaka({birthDate:new Date('1971-04-04T02:22:00Z'),analysisYear:2026});
 assert.equal(r.rows.length,9);
 assert.deepEqual(r.columnYears,{birthYear:1971,nextYear:1972,analysisYear:2026});
 assert.equal(r.rows[0].birthYear.planetName,null);
 assert.ok(r.rows[1].analysisYear.eventTimeUtc);
});
test('Solar ingress solver converges on sidereal 0 degrees in April',()=>{
 const d=ingress(2026,0,3);
 assert.equal(d.getUTCMonth(),3);
 const diff=Math.min(Math.abs(solarSidereal(d)),Math.abs(360-solarSidereal(d)));
 assert.ok(diff<0.001);
});

test('Mapped Dhanya and Dhana solar events are present without fabricating Raja',()=>{
 const r=buildClientNavanayaka({birthDate:'1971-04-04',analysisYear:2026});
 const byKey=Object.fromEntries(r.rows.map(row=>[row.key,row]));
 assert.equal(byKey.raja.analysisYear.planetName,null);
 assert.equal(byKey.dhanyadhipati.analysisYear.event,'dhanu');
 assert.equal(byKey.dhanadhipati.analysisYear.event,'kanya');
 for(const key of ['dhanyadhipati','dhanadhipati']) {
   assert.match(byKey[key].analysisYear.eventTimeUtc,/^2026-/);
   assert.equal(byKey[key].analysisYear.verification,'LOCATION_REQUIRED');
 }
});
test('Amirthu reference never asserts Subam or Asubam without a verified rule',()=>{
 const r=buildClientAmirthuBhaga({lagna:{key:'lagna',rasiNo:1,rasi:'மேஷம்',degreeInRasi:1},planets:[]});
 assert.equal(r.personalizedRows.length,10);
 assert.ok(r.personalizedRows.every(row=>row.classification==='UNVERIFIED'));
});


test('Sunrise-reckoned planetary weekday requires birthplace and resolves with coordinates',()=>{
 const {sunriseReckonedWeekday}=require('../services/clientNavanayakaService');
 assert.equal(sunriseReckonedWeekday(new Date('2026-04-14T00:00:00Z'),null,null),null);
 const r=buildClientNavanayaka({birthDate:'1971-04-04',analysisYear:2026,latitude:8.73,longitude:77.70});
 const roles=r.rows.filter(x=>x.key!=='raja');
 assert.equal(roles.length,8);
 assert.ok(roles.every(x=>x.analysisYear.verification==='PROVISIONAL' && x.analysisYear.planetKey));
});
test('Apamrityu reference and natal degree differences are formatted in degree/minute',()=>{
 const r=buildClientAmirthuBhaga({lagna:{key:'lagna',rasiNo:1,rasi:'மேஷம்',degreeInRasi:16+16/60},planets:[{key:'sun',rasiNo:12,rasi:'மீனம்',degreeInRasi:20+13/60}]});
 const sun=r.personalizedRows.find(x=>x.key==='sun');
 assert.equal(sun.actualDegreeDms,'20°13′');
 assert.equal(sun.referenceDegreeDms,'23°00′');
 assert.equal(sun.deviationDms,'2°47′');
 assert.equal(sun.classification,'UNVERIFIED');
});

test('Raja is calculated from Chaitra Shukla Pratipada using local sunrise, without inventing missing coordinates',()=>{
  const {findRajaNewYear}=require('../services/clientNavanayakaService');
  assert.equal(findRajaNewYear(2026,null,null),null);
  const r=buildClientNavanayaka({birthDate:'1971-04-04',analysisYear:2026,latitude:8.73,longitude:77.70});
  const raja=r.rows.find(x=>x.key==='raja');
  assert.equal(raja.analysisYear.planetKey,'jupiter');
  assert.equal(raja.analysisYear.determination,'KSHAYA_START_DAY_PROVISIONAL');
  assert.match(raja.analysisYear.eventTimeUtc,/^2026-03-19T/);
  assert.equal(raja.analysisYear.verification,'PROVISIONAL');
  assert.equal(raja.birthYear.planetKey,'saturn');
});
test('Raja ordinary sunrise Pratipada gives the weekday of that sunrise',()=>{
  const {findRajaNewYear}=require('../services/clientNavanayakaService');
  const value=findRajaNewYear(2025,8.73,77.70);
  assert.equal(value.determination,'UDAYAVYAPINI');
  assert.equal(value.planetKey,'sun');
  assert.match(value.timeUtc,/^2025-03-30T/);
});
