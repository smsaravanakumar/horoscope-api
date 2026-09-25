/**
 * SARA WORK START - MOLE / SCAR RULE MASTER
 *
 * Client-supplied mole/scar rule catalogue.
 *
 * IMPORTANT:
 * - ADDITIVE ONLY.
 * - This module DOES NOT evaluate horoscope conditions yet.
 * - It DOES NOT modify /api/horoscope/generate.
 * - Only rules actually supplied by the client are stored.
 * - Rule numbers 1029-1050 were not supplied and are intentionally not invented.
 */

const ruleMaster = require('../data/moleScarRules.json');

const VALID_CLASSIFICATIONS = new Set([
  'automatic_chart_rule',
  'observation_dependent',
  'reference_only',
]);

const VALID_MATCH_TYPES = new Set([
  'house_placement',
  'house_combination',
  'house_lord_placement',
  'planet_aspect',
  'navamsa_placement',
  'observed_body_mark',
  'reference',
]);

function getMoleScarRuleMaster() {
  return ruleMaster;
}

function getMoleScarRules() {
  return Array.isArray(ruleMaster.rules) ? ruleMaster.rules : [];
}

function getMoleScarRule(ruleNo) {
  const numericRuleNo = Number(ruleNo);
  if (!Number.isInteger(numericRuleNo)) return null;
  return getMoleScarRules().find((rule) => rule.ruleNo === numericRuleNo) || null;
}

function getRulesByClassification(classification) {
  return getMoleScarRules().filter(
    (rule) => rule.classification === classification
  );
}

function validateMoleScarRuleMaster() {
  const rules = getMoleScarRules();
  const errors = [];
  const warnings = [];
  const seen = new Set();

  if (!rules.length) {
    errors.push('No mole/scar rules are present.');
  }

  for (const rule of rules) {
    if (!Number.isInteger(rule.ruleNo)) {
      errors.push(`Invalid ruleNo: ${String(rule.ruleNo)}`);
      continue;
    }

    if (seen.has(rule.ruleNo)) {
      errors.push(`Duplicate ruleNo: ${rule.ruleNo}`);
    }
    seen.add(rule.ruleNo);

    for (const field of ['conditionTa', 'verseTa', 'interpretationTa']) {
      if (!String(rule[field] || '').trim()) {
        errors.push(`Rule ${rule.ruleNo} missing ${field}.`);
      }
    }

    if (!VALID_CLASSIFICATIONS.has(rule.classification)) {
      errors.push(
        `Rule ${rule.ruleNo} has invalid classification: ${rule.classification}`
      );
    }

    if (!VALID_MATCH_TYPES.has(rule.matchType)) {
      errors.push(
        `Rule ${rule.ruleNo} has invalid matchType: ${rule.matchType}`
      );
    }
  }

  const declaredMissing = Array.isArray(ruleMaster.missingRuleNos)
    ? ruleMaster.missingRuleNos
    : [];

  if (declaredMissing.length) {
    warnings.push(
      `Client source is incomplete: missing rule numbers ${declaredMissing[0]}-${declaredMissing[declaredMissing.length - 1]}.`
    );
  }

  if (ruleMaster.providedRuleCount !== rules.length) {
    errors.push(
      `providedRuleCount=${ruleMaster.providedRuleCount} but rules.length=${rules.length}.`
    );
  }

  return {
    valid: errors.length === 0,
    ruleCount: rules.length,
    errors,
    warnings,
    missingRuleNos: declaredMissing,
    counts: {
      automatic: getRulesByClassification('automatic_chart_rule').length,
      observationDependent: getRulesByClassification('observation_dependent').length,
      referenceOnly: getRulesByClassification('reference_only').length,
    },
  };
}

module.exports = {
  getMoleScarRuleMaster,
  getMoleScarRules,
  getMoleScarRule,
  getRulesByClassification,
  validateMoleScarRuleMaster,
};
