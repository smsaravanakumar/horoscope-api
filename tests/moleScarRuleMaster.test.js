const assert = require('assert');
const {
  getMoleScarRules,
  getMoleScarRule,
  getRulesByClassification,
  validateMoleScarRuleMaster,
} = require('../services/moleScarRuleMasterService');

let pass = 0;
let fail = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    pass += 1;
  } catch (error) {
    console.log(`FAIL: ${name}`);
    console.log(`      ${error.message}`);
    fail += 1;
  }
}

test('Client supplied rule count is exactly 78', () => {
  assert.strictEqual(getMoleScarRules().length, 78);
});

test('Rule 1001 is preserved', () => {
  const rule = getMoleScarRule(1001);
  assert.ok(rule);
  assert.strictEqual(rule.conditionTa, 'லக்னத்தில் ராகு');
  assert.strictEqual(rule.classification, 'automatic_chart_rule');
});

test('Rule 1051 conjunction is classified for automatic chart evaluation', () => {
  const rule = getMoleScarRule(1051);
  assert.ok(rule);
  assert.strictEqual(rule.matchType, 'house_combination');
  assert.strictEqual(rule.classification, 'automatic_chart_rule');
});

test('Navamsa rules 1094 and 1095 are present', () => {
  assert.strictEqual(getMoleScarRule(1094).matchType, 'navamsa_placement');
  assert.strictEqual(getMoleScarRule(1095).matchType, 'navamsa_placement');
});

test('Rules 1096-1099 are observation-dependent', () => {
  const rules = getRulesByClassification('observation_dependent');
  assert.deepStrictEqual(rules.map((r) => r.ruleNo), [1096, 1097, 1098, 1099]);
});

test('Rule 1100 is reference-only', () => {
  const rule = getMoleScarRule(1100);
  assert.strictEqual(rule.classification, 'reference_only');
  assert.strictEqual(rule.matchType, 'reference');
});

test('Missing client rules 1029-1050 are explicitly declared, not invented', () => {
  for (let ruleNo = 1029; ruleNo <= 1050; ruleNo += 1) {
    assert.strictEqual(getMoleScarRule(ruleNo), null);
  }
});

test('Rule master passes structural validation', () => {
  const result = validateMoleScarRuleMaster();
  assert.strictEqual(result.valid, true, result.errors.join('; '));
  assert.strictEqual(result.ruleCount, 78);
  assert.strictEqual(result.missingRuleNos.length, 22);
  assert.strictEqual(result.counts.automatic, 73);
  assert.strictEqual(result.counts.observationDependent, 4);
  assert.strictEqual(result.counts.referenceOnly, 1);
});

console.log(`\nTOTAL PASS : ${pass}`);
console.log(`TOTAL FAIL : ${fail}`);
console.log(fail === 0 ? '\nMOLE/SCAR RULE MASTER UAT: PASS' : '\nMOLE/SCAR RULE MASTER UAT: FAIL');
process.exitCode = fail === 0 ? 0 : 1;
