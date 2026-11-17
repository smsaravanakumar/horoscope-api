'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildClientGocharamDasha } = require('../services/clientGocharamDashaService');
const { buildCurrentGocharam } = require('../services/gocharamService');
const { buildDashaTimeline } = require('../services/birthCalculationDetailsService');

const year = 365.25 * 86400000;
const birthDate = new Date('2000-01-01T00:00:00Z');
const chart = (longitude, age) => ({ evaluated: true,
  dateTimeUtc: new Date(birthDate.getTime() + age * year).toISOString(),
  planets: [{key:'moon', longitude}] });
const calculate = (longitude, age, language='en') => buildClientGocharamDasha({
  birthDate, currentGocharam: chart(longitude, age), language });

test('independent known Ketu start, first Bhukti and Antaram durations', () => {
  const r = calculate(0, 0);
  assert.equal(r.evaluated,true);
  assert.equal(r.cycleYears,120);
  for (const field of ['currentDasha','currentBhukti','currentAntaram']) assert.equal(r[field].key,'ketu');
  assert.equal(Date.parse(r.currentDasha.endIsoUtc),birthDate.getTime()+7*year);
  assert.equal(Date.parse(r.currentBhukti.endIsoUtc),birthDate.getTime()+Math.floor(49/120*year));
  assert.ok(Math.abs(Date.parse(r.currentAntaram.endIsoUtc)-(birthDate.getTime()+343/14400*year))<2);
});
test('half of Ketu Nakshatra gives 3.5 years remaining from birth, then Venus', () => {
  const r = calculate(360/54, 4);
  assert.equal(r.referenceMoon.seedLordKey,'ketu');
  assert.ok(Math.abs(r.referenceMoon.progressFraction-0.5)<1e-12);
  assert.equal(r.currentDasha.key,'venus');
  assert.ok(Math.abs(Date.parse(r.currentDasha.startIsoUtc)-(birthDate.getTime()+3.5*year))<2);
});
test('120-year cycle and all 27 Nakshatra seed lords, Tamil-English numerical parity', () => {
  const keys=['ketu','venus','sun','moon','mars','rahu','jupiter','saturn','mercury'];
  for(let i=0;i<27;i++) {
    const a=calculate((i+.1)*360/27,45,'ta'), b=calculate((i+.1)*360/27,45,'en');
    assert.equal(a.referenceMoon.seedLordKey,keys[i%9]);
    for(const field of ['currentDasha','currentBhukti','currentAntaram']) {
      assert.equal(a[field].key,b[field].key);
      assert.equal(a[field].endIsoUtc,b[field].endIsoUtc);
      assert.ok(Date.parse(a[field].startIsoUtc)<=Date.parse(a.referenceIsoUtc));
      assert.ok(Date.parse(a[field].endIsoUtc)>Date.parse(a.referenceIsoUtc));
    }
    assert.ok(Date.parse(a.currentAntaram.startIsoUtc)>=Date.parse(a.currentBhukti.startIsoUtc));
    assert.ok(Date.parse(a.currentAntaram.endIsoUtc)<=Date.parse(a.currentBhukti.endIsoUtc));
  }
  assert.equal(calculate(0,120).currentDasha.key,'ketu');
});
test('real transit chart shares its exact date, Moon and birth anchor; natal unchanged', () => {
  const date=new Date('2026-11-17T07:22:22Z');
  const currentGocharam=buildCurrentGocharam({date,latitude:11.65,longitude:78.1666667,language:'en'});
  const args={birthDate,currentGocharam,language:'en'};
  const snapshot=JSON.stringify(args);
  const natalArgs={birthDate,moon:{longitude:123},language:'en',currentDate:date};
  const before=buildDashaTimeline(natalArgs);
  const r=buildClientGocharamDasha(args);
  assert.equal(r.referenceIsoUtc,date.toISOString());
  assert.equal(r.referenceMoon.nakshatra,currentGocharam.planets.find(p=>p.key==='moon').nakshatra);
  assert.equal(r.birthAnchorIsoUtc,birthDate.toISOString());
  assert.equal(JSON.stringify(args),snapshot);
  assert.deepEqual(buildDashaTimeline(natalArgs),before);
});
test('invalid or future birth inputs do not fabricate periods', () => {
  assert.equal(calculate(0,-1).evaluated,false);
  assert.equal(calculate(NaN,20).evaluated,false);
  assert.equal(buildClientGocharamDasha({birthDate,currentGocharam:{}}).evaluated,false);
});

test('HTTP response exposes Gocharam periods, frozen natal and matching transit instant in both languages', async () => {
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.use('/api/horoscope',require('../routes/horoscope'));
  const server = await new Promise(resolve => { const s=app.listen(0,'127.0.0.1',()=>resolve(s)); });
  try {
    for(const language of ['ta','en']) {
      const res=await fetch(`http://127.0.0.1:${server.address().port}/api/horoscope/generate`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
          name:'UAT Test',gender:'male',birthDate:'02-07-1969',birthTime:'04:05 PM',
          place:'Sirkazhi, Tamil Nadu, India',latitude:11.65,longitude:78.1666666667,language})});
      assert.equal(res.status,200);
      const body=await res.json();
      const periods=body.clientDashaPeriods;
      assert.equal(periods.gocharam.evaluated,true);
      assert.equal(periods.gocharam.referenceIsoUtc,body.currentGocharam.dateTimeUtc);
      assert.equal(periods.gocharam.referenceMoon.nakshatra,body.currentGocharam.planets.find(p=>p.key==='moon').nakshatra);
      assert.deepEqual(periods.natal,body.birthCalculationDetails.dashaTimeline);
      assert.equal(periods.gocharam.currentAntaram.key.length>0,true);
    }
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
