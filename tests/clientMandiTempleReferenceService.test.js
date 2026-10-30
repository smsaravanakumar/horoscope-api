'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../data/clientMandiHouseTemples.json');
const { selectMandiTempleByHouse } = require('../services/clientMandiTempleReferenceService');
const { buildMandiDosha } = require('../services/mandiDoshaService');

test('client reference covers all twelve houses uniquely with temple and location', () => {
  assert.equal(data.entries.length, 12);
  assert.equal(new Set(data.entries.map(e => e.houseNumber)).size, 12);
  for (let house=1;house<=12;house++) {
    const record=selectMandiTempleByHouse(house);
    assert.equal(record.houseNumber, house);
    assert.ok(record.temple && record.location);
  }
});
test('house 11 temple remains present while Mandi Dosha remains absent', () => {
  const result=buildMandiDosha({lagna:{rasiNo:1}, planets:[{key:'mandi',rasiNo:11}],language:'ta'});
  assert.equal(result.house,11);
  assert.equal(result.result,false);
  assert.equal(result.templeReference.temple,'மடப்புரம் பத்ரகாளியம்மன்');
  assert.deepEqual(result.remedyTemples, []); // frozen legacy Dosha behaviour
});
test('all twelve lagna-relative positions select matching reference without changing Dosha rules', () => {
  for (let house=1;house<=12;house++) {
    const result=buildMandiDosha({lagna:{rasiNo:2},planets:[{key:'mandi',rasiNo:((2+house-2)%12)+1}]});
    assert.equal(result.house,house);
    assert.equal(result.templeReference.houseNumber,house);
    assert.equal(result.result,![3,6,11].includes(house));
  }
});
test('missing or invalid houses do not invent temple details; English preserves Tamil source names', () => {
  assert.equal(selectMandiTempleByHouse(0),null);
  assert.equal(selectMandiTempleByHouse(13),null);
  assert.equal(selectMandiTempleByHouse('5'),null);
  const english=selectMandiTempleByHouse(11,'en');
  assert.equal(english.originalLanguage,'ta');
  assert.equal(english.temple,'மடப்புரம் பத்ரகாளியம்மன்');
  assert.equal(buildMandiDosha({lagna:null,planets:[]}).templeReference,null);
});
