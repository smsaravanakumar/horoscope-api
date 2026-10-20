'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const {buildChartPlanetaryTable:table}=require('../services/chartPlanetaryTableService');
test('known longitude boundaries, status and input immutability',()=>{
 const planets=[{key:'sun',name:'Sun',longitude:10,retrograde:false},
 {key:'moon',name:'Moon',longitude:40.01,retrograde:true},
 {key:'saturn',longitude:359.999999}];
 const before=JSON.stringify(planets);
 const rows=table({planets,language:'en'});
 assert.equal(rows[0].nakshatraLord.key,'ketu');
 assert.equal(rows[0].pada,4);
 assert.equal(rows[0].relationship.key,'exalted');
 assert.equal(rows[1].rasiNo,2);
 assert.equal(rows[1].nakshatraLord.key,'moon');
 assert.equal(rows[1].pada,1);
 assert.equal(rows[1].retrograde,true);
 assert.equal(rows[2].degreeDms.text,'29:59:59');
 assert.equal(JSON.stringify(planets),before);
});
test('Tamil and English preserve numeric values and excluded bodies have no status',()=>{
 const planets=[{key:'rahu',longitude:45},{key:'ketu',longitude:225},{key:'mandi',longitude:66}];
 const ta=table({planets,language:'ta'}),en=table({planets,language:'en'});
 assert.deepEqual(ta.map(r=>[r.longitude,r.pada,r.rasiNo]),en.map(r=>[r.longitude,r.pada,r.rasiNo]));
 assert.notEqual(ta[0].name,en[0].name);
 assert.ok(en.every(r=>r.relationship.key==='notApplicable'));
 assert.deepEqual(table({}),[]);
});
