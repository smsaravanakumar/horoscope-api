'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {resolveTempleReferences,normalizeNakshatraNumber,normalizeHouseNumber,normalizeRasiNumber,validateReferenceCoverage}=require('../services/clientTempleReferenceService');
test('Source data covers 27 Yogi/Avayogi pairs and 12 houses for all 12 signs',()=>{
 const coverage=validateReferenceCoverage();
 assert.equal(coverage.nakshatras,27);assert.equal(coverage.yogiAndAvayogiPairsComplete,true);
 assert.equal(coverage.planetaryGroups,7);assert.equal(coverage.mudakkuSignHouseRows,144);
 assert.equal(coverage.mudakkuTwelveSignsCovered,true);
});
test('Client reference temple selection follows existing calculations without mutation',()=>{
 const original={yogiAvayogi:{yogi:{nakshatraNumber:1},avayogi:{nakshatraNumber:27}},mudakku:{rasiNumber:8}};
 const snapshot=JSON.stringify(original);
 const ta=resolveTempleReferences({horoscopeDetails:original,language:'ta'});
 const en=resolveTempleReferences({horoscopeDetails:original,language:'en'});
 assert.match(ta.yogiTemple.temple,/சேஷபுரீஸ்வரர்/);
 assert.match(ta.avayogiTemple.temple,/கலியுக/);
 assert.equal(ta.mudakkuHouseTemple,null);
 assert.equal(ta.mudakkuHouseOptions.length,12);
 assert.equal(ta.mudakkuHouseOptions[0].houseNumber,1);
 assert.deepEqual(ta.selection,en.selection);
 assert.equal(en.yogiTemple.originalLanguage,'ta');
 assert.equal(JSON.stringify(original),snapshot);
});
test('Selecting Mudakku house is explicit, never guessed',()=>{
 const details={mudakku:{rasiNumber:8}};
 const unselected=resolveTempleReferences({horoscopeDetails:details});
 assert.equal(unselected.selection.mudakkuHouseNo,null);
 assert.equal(unselected.mudakkuHouseTemple,null);
 const selected=resolveTempleReferences({horoscopeDetails:details,mudakkuHouseNumber:12});
 assert.equal(selected.selection.mudakkuHouseNo,12);
 assert.ok(selected.mudakkuHouseTemple.temple);
});
test('Range and missing-value validation rejects invalid inputs',()=>{
 for (const n of [null,undefined,'',0,28,-1,1.5,'bad']) assert.equal(normalizeNakshatraNumber(n),null);
 assert.equal(normalizeNakshatraNumber(27),27);
 assert.equal(normalizeHouseNumber(13),null);assert.equal(normalizeHouseNumber(12),12);
 assert.equal(normalizeRasiNumber(0),null);assert.equal(normalizeRasiNumber(12),12);
});
test('All 27 entries resolve to both Yogi and Avayogi',()=>{
 for(let number=1;number<=27;number++){
  const result=resolveTempleReferences({horoscopeDetails:{yogiAvayogi:{yogi:{nakshatraNumber:number},avayogi:{nakshatraNumber:number}}}});
  assert.ok(result.yogiTemple?.temple,`Missing Yogi ${number}`);
  assert.ok(result.avayogiTemple?.temple,`Missing Avayogi ${number}`);
 }
});
test('All twelve rasi options have twelve distinct houses',()=>{
 for(let rasi=1;rasi<=12;rasi++){
  const result=resolveTempleReferences({horoscopeDetails:{mudakku:{rasiNumber:rasi}}});
  assert.deepEqual(result.mudakkuHouseOptions.map(x=>x.houseNumber),Array.from({length:12},(_,i)=>i+1));
 }
});

// Integrated selection from *existing* natal Lagna and the already calculated Mudakku Rasi.
test('All 144 Lagna/Mudakku combinations select the corresponding house without changing inputs',()=>{
 const {mudakkuHouseFromLagna}=require('../services/clientTempleReferenceService');
 for(let lagna=1;lagna<=12;lagna++) for(let rasi=1;rasi<=12;rasi++) {
   const house=((rasi-lagna+12)%12)+1;
   const details={mudakku:{rasiNumber:rasi}};
   const original=JSON.stringify(details);
   const result=resolveTempleReferences({horoscopeDetails:details,lagnaRasiNumber:lagna,language:'ta'});
   assert.equal(mudakkuHouseFromLagna(lagna,rasi),house);
   assert.equal(result.selection.mudakkuHouseNo,house);
   assert.equal(result.selection.mudakkuHouseSource,'lagna_rasi');
   assert.ok(result.mudakkuHouseTemple?.temple);
   assert.deepEqual(result.mudakkuHouseTemple, result.mudakkuHouseOptions[house-1].temple);
   assert.equal(JSON.stringify(details),original);
 }
});
test('Missing Lagna does not select a Mudakku house, and explicit legacy house still works',()=>{
 const details={mudakku:{rasiNumber:5}};
 const absent=resolveTempleReferences({horoscopeDetails:details});
 assert.equal(absent.mudakkuHouseTemple,null);
 assert.equal(absent.selection.mudakkuHouseNo,null);
 const legacy=resolveTempleReferences({horoscopeDetails:details,mudakkuHouseNumber:7});
 assert.equal(legacy.selection.mudakkuHouseNo,7);
});
