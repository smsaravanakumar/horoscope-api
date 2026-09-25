const http = require('http');
const express = require('express');
const path = require('path');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function postJson({ port, pathName, payload }) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: pathName,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 30000,
    }, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { text += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(text || '{}') });
        } catch (error) {
          reject(new Error(`Non-JSON response: ${text.slice(0, 300)}`));
        }
      });
    });

    req.on('timeout', () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // This is an HTTP-level route integration test. Only the external geocoder is
  // stubbed so UAT is deterministic and independent of Nominatim 429 limits.
  const geocodePath = require.resolve('../services/geocodeService');
  const originalGeocodeModule = require(geocodePath);

  require.cache[geocodePath].exports = {
    ...originalGeocodeModule,
    getCoordinates: async () => ({
      latitude: 10.0728444,
      longitude: 78.7795194,
    }),
  };

  const routePath = require.resolve('../routes/horoscope');
  delete require.cache[routePath];
  const horoscopeRoutes = require('../routes/horoscope');

  const app = express();
  app.use(express.json());
  app.use('/api/horoscope', horoscopeRoutes);

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });

  const port = server.address().port;
  let pass = 0;
  let fail = 0;

  function check(name, fn) {
    try {
      fn();
      console.log(`PASS: ${name}`);
      pass += 1;
    } catch (error) {
      console.error(`FAIL: ${name}`);
      console.error(`      ${error.message}`);
      fail += 1;
    }
  }

  try {
    const response = await postJson({
      port,
      pathName: '/api/horoscope/generate',
      payload: {
        name: 'Step3 UAT',
        gender: 'male',
        birthDate: '1975-12-16',
        birthTime: '23:28',
        place: 'Karaikudi, Tamil Nadu, India',
        language: 'ta',
      },
    });

    check('HTTP /api/horoscope/generate returns 200', () => {
      assert(response.statusCode === 200, `Expected 200, got ${response.statusCode}: ${JSON.stringify(response.body).slice(0, 300)}`);
    });

    const data = response.body;
    check('Existing API success response remains true', () => {
      assert(data.success === true, 'success must be true');
    });

    check('Existing core horoscope fields are still present', () => {
      assert(data.lagna && typeof data.lagna === 'object', 'lagna missing');
      assert(Array.isArray(data.planets) && data.planets.length >= 10, 'planets missing');
      assert(data.chart && typeof data.chart === 'object', 'chart missing');
      assert(data.navamsaChart && typeof data.navamsaChart === 'object', 'navamsaChart missing');
      assert(data.clientAstroRules && typeof data.clientAstroRules === 'object', 'clientAstroRules missing');
      assert(data.currentGocharam && typeof data.currentGocharam === 'object', 'currentGocharam missing');
    });

    check('moleScarAnalysis is returned as a top-level API block', () => {
      assert(data.moleScarAnalysis && typeof data.moleScarAnalysis === 'object', 'moleScarAnalysis missing');
      assert(data.moleScarAnalysis.evaluated === true, 'moleScarAnalysis.evaluated must be true');
    });

    check('moleScarAnalysis returns matched automatic rules', () => {
      assert(Array.isArray(data.moleScarAnalysis.matchedRules), 'matchedRules missing');
      assert(data.moleScarAnalysis.matchedRules.length > 0, 'expected at least one matched automatic rule');
      for (const rule of data.moleScarAnalysis.matchedRules) {
        assert(rule.matched === true, `rule ${rule.ruleNo} matched flag must be true`);
        assert(Number.isInteger(rule.ruleNo), 'matched ruleNo must be integer');
        assert(rule.evidence && typeof rule.evidence === 'object', `rule ${rule.ruleNo} evidence missing`);
      }
    });

    check('observation-dependent Rules 1096-1099 are preserved but not auto-matched', () => {
      const rules = data.moleScarAnalysis.observationDependentRules;
      assert(Array.isArray(rules), 'observationDependentRules missing');
      assert(JSON.stringify(rules.map((r) => r.ruleNo)) === JSON.stringify([1096, 1097, 1098, 1099]),
        `unexpected observation rules: ${JSON.stringify(rules.map((r) => r.ruleNo))}`);
      const autoMatched = new Set(data.moleScarAnalysis.matchedRules.map((r) => r.ruleNo));
      for (const no of [1096, 1097, 1098, 1099]) {
        assert(!autoMatched.has(no), `observation rule ${no} must not auto-match`);
      }
    });

    check('Rule 1100 remains reference-only', () => {
      const rules = data.moleScarAnalysis.referenceRules;
      assert(Array.isArray(rules) && rules.length === 1, 'expected one reference-only rule');
      assert(rules[0].ruleNo === 1100, `expected Rule 1100, got ${rules[0]?.ruleNo}`);
    });

    check('Missing client Rule Nos 1029-1050 remain explicitly declared', () => {
      const expected = Array.from({ length: 22 }, (_, index) => 1029 + index);
      assert(JSON.stringify(data.moleScarAnalysis.missingRuleNos) === JSON.stringify(expected),
        `unexpected missingRuleNos: ${JSON.stringify(data.moleScarAnalysis.missingRuleNos)}`);
    });

    check('Summary is internally consistent', () => {
      const m = data.moleScarAnalysis;
      assert(m.summary && typeof m.summary === 'object', 'summary missing');
      assert(m.summary.suppliedRules === 78, `suppliedRules expected 78, got ${m.summary.suppliedRules}`);
      assert(m.summary.automaticRules === 73, `automaticRules expected 73, got ${m.summary.automaticRules}`);
      assert(m.summary.observationDependentRules === 4, 'observationDependentRules summary expected 4');
      assert(m.summary.referenceRules === 1, 'referenceRules summary expected 1');
      assert(m.summary.matchedAutomaticRules === m.matchedRules.length,
        'matchedAutomaticRules must equal matchedRules.length');
    });

    console.log('\nMole/Scar matched Rule Nos:', data.moleScarAnalysis.matchedRules.map((r) => r.ruleNo).join(', '));
    console.log(`Matched automatic rules: ${data.moleScarAnalysis.summary.matchedAutomaticRules}`);
    console.log(`Unsupported automatic rules: ${data.moleScarAnalysis.summary.unsupportedRules}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    require.cache[geocodePath].exports = originalGeocodeModule;
  }

  console.log(`\nTOTAL PASS : ${pass}`);
  console.log(`TOTAL FAIL : ${fail}`);

  if (fail > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('\nMOLE/SCAR API INTEGRATION UAT: PASS');
}

main().catch((error) => {
  console.error('MOLE/SCAR API INTEGRATION UAT: FAIL');
  console.error(error);
  process.exitCode = 1;
});
