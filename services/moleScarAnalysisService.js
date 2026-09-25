/**
 * SARA WORK START - MOLE / SCAR CALCULATION ENGINE
 *
 * API Step 2.
 *
 * IMPORTANT:
 * - ADDITIVE ONLY.
 * - Consumes the frozen client rule master from data/moleScarRules.json.
 * - DOES NOT modify /api/horoscope/generate in this step.
 * - DOES NOT alter any existing horoscope, Dasha, Yoga, Nadi, Pakshi,
 *   D1-D60, Gocharam, Mandi, Pitru or other locked calculations.
 * - Rules 1029-1050 are not present in the client source and are never invented.
 * - Observation-dependent rules 1096-1099 are intentionally NOT auto-matched.
 * - Rule 1100 is reference-only and is intentionally NOT auto-matched.
 */

const {
  getMoleScarRuleMaster,
  getRulesByClassification,
} = require('./moleScarRuleMasterService');

const PLANET_KEY_BY_TAMIL = {
  'சூரியன்': 'sun',
  'சந்திரன்': 'moon',
  'செவ்வாய்': 'mars',
  'புதன்': 'mercury',
  'குரு': 'jupiter',
  'சுக்கிரன்': 'venus',
  'சனி': 'saturn',
  'ராகு': 'rahu',
  'கேது': 'ketu',
};

const SIGN_LORD_KEYS = {
  1: 'mars',
  2: 'venus',
  3: 'mercury',
  4: 'moon',
  5: 'sun',
  6: 'mercury',
  7: 'venus',
  8: 'mars',
  9: 'jupiter',
  10: 'saturn',
  11: 'saturn',
  12: 'jupiter',
};

// Keep aspect conventions aligned with the existing astrologyService.js engine.
const ASPECT_OFFSETS = {
  sun: [7],
  moon: [7],
  mercury: [7],
  venus: [7],
  rahu: [7],
  ketu: [7],
  mars: [4, 7, 8],
  jupiter: [5, 7, 9],
  saturn: [3, 7, 10],
};

function normalizeDegree(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  let normalized = numeric % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

function rasiNoFromLongitude(value) {
  const normalized = normalizeDegree(value);
  if (normalized === null) return null;
  return Math.floor(normalized / 30) + 1;
}

function getLagnaRasiNo(lagna) {
  const direct = Number(lagna?.rasiNo);
  if (Number.isInteger(direct) && direct >= 1 && direct <= 12) {
    return direct;
  }
  return rasiNoFromLongitude(lagna?.longitude);
}

function getPlanetRasiNo(planet) {
  const direct = Number(planet?.rasiNo);
  if (Number.isInteger(direct) && direct >= 1 && direct <= 12) {
    return direct;
  }
  return rasiNoFromLongitude(planet?.longitude);
}

function getHouseNumberFromRasi({ lagnaRasiNo, rasiNo }) {
  if (
    !Number.isInteger(lagnaRasiNo) ||
    lagnaRasiNo < 1 ||
    lagnaRasiNo > 12 ||
    !Number.isInteger(rasiNo) ||
    rasiNo < 1 ||
    rasiNo > 12
  ) {
    return null;
  }

  return ((rasiNo - lagnaRasiNo + 12) % 12) + 1;
}

function indexChart({ lagna, planets }) {
  const lagnaRasiNo = getLagnaRasiNo(lagna);
  const planetByKey = {};
  const houseByPlanetKey = {};

  for (const planet of Array.isArray(planets) ? planets : []) {
    if (!planet || !planet.key) continue;
    const rasiNo = getPlanetRasiNo(planet);
    planetByKey[planet.key] = planet;
    houseByPlanetKey[planet.key] = getHouseNumberFromRasi({
      lagnaRasiNo,
      rasiNo,
    });
  }

  return {
    lagnaRasiNo,
    planetByKey,
    houseByPlanetKey,
  };
}

function planetKeyFromTamil(value) {
  const cleaned = String(value || '')
    .replace(/பார்வை/g, '')
    .trim();
  return PLANET_KEY_BY_TAMIL[cleaned] || null;
}

function splitConditionHouse(conditionTa) {
  const text = String(conditionTa || '').trim();

  if (text.startsWith('லக்னத்தில் ')) {
    return {
      house: 1,
      expression: text.slice('லக்னத்தில் '.length).trim(),
    };
  }

  const match = text.match(/^(\d+)-ல்\s+(.+)$/);
  if (!match) return null;

  return {
    house: Number(match[1]),
    expression: match[2].trim(),
  };
}

function evaluateHousePlacement(rule, chart) {
  const parsed = splitConditionHouse(rule.conditionTa);
  if (!parsed) {
    return { supported: false, matched: false, reason: 'condition_parse_failed' };
  }

  const planetKey = planetKeyFromTamil(parsed.expression);
  if (!planetKey) {
    return { supported: false, matched: false, reason: 'planet_parse_failed' };
  }

  const actualHouse = chart.houseByPlanetKey[planetKey] ?? null;
  const matched = actualHouse === parsed.house;

  return {
    supported: true,
    matched,
    evidence: {
      type: 'house_placement',
      requiredHouse: parsed.house,
      planetKey,
      actualHouse,
      rasiNo: getPlanetRasiNo(chart.planetByKey[planetKey]),
    },
  };
}

function evaluateHouseCombination(rule, chart) {
  const parsed = splitConditionHouse(rule.conditionTa);
  if (!parsed) {
    return { supported: false, matched: false, reason: 'condition_parse_failed' };
  }

  const expression = parsed.expression;

  // Client Rule 1067: Rahu must occupy the 6th house and Ketu must aspect it.
  if (expression.includes('+') && expression.includes('பார்வை')) {
    const parts = expression.split('+').map((part) => part.trim());
    if (parts.length !== 2) {
      return { supported: false, matched: false, reason: 'aspect_combination_parse_failed' };
    }

    const residentPlanetKey = planetKeyFromTamil(parts[0]);
    const aspectingPlanetKey = planetKeyFromTamil(parts[1]);
    if (!residentPlanetKey || !aspectingPlanetKey) {
      return { supported: false, matched: false, reason: 'planet_parse_failed' };
    }

    const residentHouse = chart.houseByPlanetKey[residentPlanetKey] ?? null;
    const aspectTargets = buildAspectHouseTargets(
      aspectingPlanetKey,
      chart.houseByPlanetKey[aspectingPlanetKey]
    );

    return {
      supported: true,
      matched:
        residentHouse === parsed.house &&
        aspectTargets.includes(parsed.house),
      evidence: {
        type: 'resident_plus_aspect',
        requiredHouse: parsed.house,
        residentPlanetKey,
        residentActualHouse: residentHouse,
        aspectingPlanetKey,
        aspectingFromHouse: chart.houseByPlanetKey[aspectingPlanetKey] ?? null,
        aspectTargetHouses: aspectTargets,
      },
    };
  }

  // A slash in the client condition/interpretation means either planet can
  // independently satisfy the stated house condition.
  if (expression.includes('/')) {
    const planetKeys = expression
      .split('/')
      .map((part) => planetKeyFromTamil(part))
      .filter(Boolean);

    if (planetKeys.length !== 2) {
      return { supported: false, matched: false, reason: 'or_condition_parse_failed' };
    }

    const matchedPlanetKeys = planetKeys.filter(
      (key) => chart.houseByPlanetKey[key] === parsed.house
    );

    return {
      supported: true,
      matched: matchedPlanetKeys.length > 0,
      evidence: {
        type: 'house_any_of',
        requiredHouse: parsed.house,
        requiredPlanetKeys: planetKeys,
        matchedPlanetKeys,
        actualHouses: Object.fromEntries(
          planetKeys.map((key) => [key, chart.houseByPlanetKey[key] ?? null])
        ),
      },
    };
  }

  // A plus sign means both planets must occupy the stated house.
  if (expression.includes('+')) {
    const planetKeys = expression
      .split('+')
      .map((part) => planetKeyFromTamil(part))
      .filter(Boolean);

    if (planetKeys.length !== 2) {
      return { supported: false, matched: false, reason: 'and_condition_parse_failed' };
    }

    const actualHouses = Object.fromEntries(
      planetKeys.map((key) => [key, chart.houseByPlanetKey[key] ?? null])
    );

    return {
      supported: true,
      matched: planetKeys.every(
        (key) => chart.houseByPlanetKey[key] === parsed.house
      ),
      evidence: {
        type: 'house_all_of',
        requiredHouse: parsed.house,
        requiredPlanetKeys: planetKeys,
        actualHouses,
      },
    };
  }

  return { supported: false, matched: false, reason: 'combination_operator_missing' };
}

function houseSignNo(lagnaRasiNo, houseNo) {
  if (
    !Number.isInteger(lagnaRasiNo) ||
    !Number.isInteger(houseNo) ||
    houseNo < 1 ||
    houseNo > 12
  ) {
    return null;
  }
  return ((lagnaRasiNo + houseNo - 2) % 12) + 1;
}

function evaluateHouseLordPlacement(rule, chart) {
  const ruleMap = {
    1087: { lordOfHouse: 1, targetHouse: 8 },
    1088: { lordOfHouse: 1, targetHouse: 6 },
    1089: { lordOfHouse: 8, targetHouse: 1 },
    1090: { lordOfHouse: 6, targetHouse: 3 },
  };

  const requirement = ruleMap[rule.ruleNo];
  if (!requirement) {
    return { supported: false, matched: false, reason: 'house_lord_rule_not_mapped' };
  }

  const signNo = houseSignNo(chart.lagnaRasiNo, requirement.lordOfHouse);
  const lordPlanetKey = signNo ? SIGN_LORD_KEYS[signNo] : null;
  const actualHouse = lordPlanetKey
    ? chart.houseByPlanetKey[lordPlanetKey] ?? null
    : null;

  return {
    supported: Boolean(lordPlanetKey),
    matched: Boolean(lordPlanetKey && actualHouse === requirement.targetHouse),
    evidence: {
      type: 'house_lord_placement',
      lordOfHouse: requirement.lordOfHouse,
      lordSignNo: signNo,
      lordPlanetKey,
      requiredHouse: requirement.targetHouse,
      actualHouse,
    },
  };
}

function buildAspectHouseTargets(planetKey, fromHouse) {
  if (!Number.isInteger(fromHouse) || fromHouse < 1 || fromHouse > 12) {
    return [];
  }

  const offsets = ASPECT_OFFSETS[planetKey] || [7];
  return offsets.map(
    (offset) => ((fromHouse + offset - 2) % 12) + 1
  );
}

function evaluatePlanetAspect(rule, chart) {
  const planetKeyByRule = {
    1091: 'jupiter',
    1092: 'saturn',
    1093: 'mars',
  };

  const planetKey = planetKeyByRule[rule.ruleNo];
  if (!planetKey) {
    return { supported: false, matched: false, reason: 'planet_aspect_rule_not_mapped' };
  }

  const fromHouse = chart.houseByPlanetKey[planetKey] ?? null;
  const targetHouses = buildAspectHouseTargets(planetKey, fromHouse);

  return {
    supported: Boolean(fromHouse && targetHouses.length),
    // These client rules describe the body area corresponding to every house
    // aspected by the named planet. Therefore a valid planet placement is enough
    // to evaluate the rule; the actual target houses are returned as evidence.
    matched: Boolean(fromHouse && targetHouses.length),
    evidence: {
      type: 'planet_aspect',
      planetKey,
      fromHouse,
      aspectOffsets: ASPECT_OFFSETS[planetKey] || [7],
      targetHouses,
    },
  };
}

function getNavamsaRasiNumber(longitude) {
  const normalized = normalizeDegree(longitude);
  if (normalized === null) return null;

  const signNo = Math.floor(normalized / 30) + 1;
  const degreeInSign = normalized % 30;
  const navamsaIndex = Math.floor(degreeInSign / (30 / 9));

  let startSign;
  if ([1, 4, 7, 10].includes(signNo)) {
    startSign = signNo;
  } else if ([2, 5, 8, 11].includes(signNo)) {
    startSign = signNo + 8;
  } else {
    startSign = signNo + 4;
  }

  while (startSign > 12) startSign -= 12;

  let navamsaRasiNo = startSign + navamsaIndex;
  while (navamsaRasiNo > 12) navamsaRasiNo -= 12;

  return navamsaRasiNo;
}

function evaluateNavamsaPlacement(rule, chart) {
  const planetKeyByRule = {
    1094: 'rahu',
    1095: 'ketu',
  };

  const planetKey = planetKeyByRule[rule.ruleNo];
  const planet = planetKey ? chart.planetByKey[planetKey] : null;
  const navamsaRasiNo = planet
    ? getNavamsaRasiNumber(planet.longitude)
    : null;

  return {
    supported: Boolean(planetKey),
    // Rahu/Ketu necessarily occupy one Navamsa sign when their longitude exists.
    // The matched Navamsa sign is the rule result/evidence.
    matched: Number.isInteger(navamsaRasiNo),
    evidence: {
      type: 'navamsa_placement',
      planetKey,
      natalRasiNo: getPlanetRasiNo(planet),
      navamsaRasiNo,
    },
  };
}

function evaluateAutomaticRule(rule, chart) {
  switch (rule.matchType) {
    case 'house_placement':
      return evaluateHousePlacement(rule, chart);
    case 'house_combination':
      return evaluateHouseCombination(rule, chart);
    case 'house_lord_placement':
      return evaluateHouseLordPlacement(rule, chart);
    case 'planet_aspect':
      return evaluatePlanetAspect(rule, chart);
    case 'navamsa_placement':
      return evaluateNavamsaPlacement(rule, chart);
    default:
      return {
        supported: false,
        matched: false,
        reason: `unsupported_match_type:${rule.matchType}`,
      };
  }
}

function toMatchedRule(rule, evaluation) {
  return {
    ruleNo: rule.ruleNo,
    matched: true,
    classification: rule.classification,
    matchType: rule.matchType,
    conditionTa: rule.conditionTa,
    verseTa: rule.verseTa,
    interpretationTa: rule.interpretationTa,
    sourceGroupTa: rule.sourceGroupTa,
    evidence: evaluation.evidence || null,
  };
}

function toPendingRule(rule) {
  return {
    ruleNo: rule.ruleNo,
    classification: rule.classification,
    matchType: rule.matchType,
    conditionTa: rule.conditionTa,
    verseTa: rule.verseTa,
    interpretationTa: rule.interpretationTa,
    sourceGroupTa: rule.sourceGroupTa,
  };
}

function getAutomaticRuleCoverage() {
  const automaticRules = getRulesByClassification('automatic_chart_rule');
  const supportedRuleNos = [];
  const unsupported = [];

  // Coverage is checked with a neutral chart index; parser/mapping support
  // does not require a real horoscope match.
  const neutralChart = {
    lagnaRasiNo: 1,
    planetByKey: {},
    houseByPlanetKey: {},
  };

  for (const rule of automaticRules) {
    const evaluation = evaluateAutomaticRule(rule, neutralChart);
    if (evaluation.supported || evaluation.reason === undefined) {
      supportedRuleNos.push(rule.ruleNo);
      continue;
    }

    // Some supported evaluators legitimately report supported=false if the
    // neutral chart lacks a planet. Detect those by rule type/mapping instead.
    const knownType = [
      'house_placement',
      'house_combination',
      'house_lord_placement',
      'planet_aspect',
      'navamsa_placement',
    ].includes(rule.matchType);

    const parseOnlyFailure = String(evaluation.reason || '').includes('parse_failed') ||
      String(evaluation.reason || '').includes('not_mapped') ||
      String(evaluation.reason || '').includes('operator_missing') ||
      String(evaluation.reason || '').startsWith('unsupported_match_type');

    if (knownType && !parseOnlyFailure) {
      supportedRuleNos.push(rule.ruleNo);
    } else {
      unsupported.push({
        ruleNo: rule.ruleNo,
        conditionTa: rule.conditionTa,
        matchType: rule.matchType,
        reason: evaluation.reason || 'unsupported',
      });
    }
  }

  return {
    automaticRuleCount: automaticRules.length,
    supportedRuleCount: supportedRuleNos.length,
    supportedRuleNos,
    unsupported,
  };
}

function buildMoleScarAnalysis({
  lagna,
  planets,
  aspects, // accepted for forward compatibility; Step 2 uses the same house-based convention internally
  gender,
  language = 'ta',
} = {}) {
  void aspects;
  void gender;
  void language;

  const ruleMaster = getMoleScarRuleMaster();
  const automaticRules = getRulesByClassification('automatic_chart_rule');
  const observationRules = getRulesByClassification('observation_dependent');
  const referenceRules = getRulesByClassification('reference_only');
  const chart = indexChart({ lagna, planets });

  if (!chart.lagnaRasiNo) {
    return {
      evaluated: false,
      reason: 'lagna_rasi_unavailable',
      calculationMethod: 'client_mole_scar_rule_master_v1',
      matchedRules: [],
      unsupportedRules: [],
      observationDependentRules: observationRules.map(toPendingRule),
      referenceRules: referenceRules.map(toPendingRule),
      missingRuleNos: Array.isArray(ruleMaster.missingRuleNos)
        ? [...ruleMaster.missingRuleNos]
        : [],
      summary: {
        suppliedRules: Array.isArray(ruleMaster.rules) ? ruleMaster.rules.length : 0,
        automaticRules: automaticRules.length,
        matchedAutomaticRules: 0,
        observationDependentRules: observationRules.length,
        referenceRules: referenceRules.length,
      },
    };
  }

  const matchedRules = [];
  const unsupportedRules = [];

  for (const rule of automaticRules) {
    const evaluation = evaluateAutomaticRule(rule, chart);

    if (!evaluation.supported) {
      unsupportedRules.push({
        ruleNo: rule.ruleNo,
        conditionTa: rule.conditionTa,
        matchType: rule.matchType,
        reason: evaluation.reason || 'required_chart_data_unavailable',
      });
      continue;
    }

    if (evaluation.matched) {
      matchedRules.push(toMatchedRule(rule, evaluation));
    }
  }

  matchedRules.sort((a, b) => a.ruleNo - b.ruleNo);
  unsupportedRules.sort((a, b) => a.ruleNo - b.ruleNo);

  return {
    evaluated: true,
    calculationMethod: 'client_mole_scar_rule_master_v1',
    matchedRules,
    unsupportedRules,
    observationDependentRules: observationRules.map(toPendingRule),
    referenceRules: referenceRules.map(toPendingRule),
    missingRuleNos: Array.isArray(ruleMaster.missingRuleNos)
      ? [...ruleMaster.missingRuleNos]
      : [],
    summary: {
      suppliedRules: Array.isArray(ruleMaster.rules) ? ruleMaster.rules.length : 0,
      automaticRules: automaticRules.length,
      matchedAutomaticRules: matchedRules.length,
      unsupportedRules: unsupportedRules.length,
      observationDependentRules: observationRules.length,
      referenceRules: referenceRules.length,
    },
  };
}

module.exports = {
  buildMoleScarAnalysis,
  getAutomaticRuleCoverage,
  getHouseNumberFromRasi,
  buildAspectHouseTargets,
  getNavamsaRasiNumber,
};
