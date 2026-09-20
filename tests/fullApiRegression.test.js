const http = require('http');

const API_HOST = process.env.HOROSCOPE_API_HOST || 'localhost';
const API_PORT = Number(process.env.HOROSCOPE_API_PORT || 3000);
const API_PATH = '/api/horoscope/generate';

function postJson(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request({
      hostname: API_HOST,
      port: API_PORT,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 30000,
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data || '{}');
        } catch (err) {
          return reject(new Error(`Non-JSON response (${res.statusCode}): ${data.slice(0, 300)}`));
        }
        resolve({ statusCode: res.statusCode, body: parsed });
      });
    });
    req.on('timeout', () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function validateCommonApiShape(data) {
  assert(data.success === true, 'success must be true');
  assert(hasObject(data.input), 'input missing');
  assert(hasObject(data.normalizedInput), 'normalizedInput missing');
  assert(hasObject(data.coordinates), 'coordinates missing');
  assert(Number.isFinite(data.ayanamsa), 'ayanamsa missing/invalid');
  assert(hasObject(data.lagna), 'lagna missing');
  assert(Array.isArray(data.planets), 'planets missing');
  assert(data.planets.length >= 10, 'expected Sun..Ketu + Mandi');
  assert(hasObject(data.dasha), 'dasha missing');
  assert(hasObject(data.additionalAstroAnalysis), 'additionalAstroAnalysis missing');
  assert(hasObject(data.clientAstroRules), 'clientAstroRules missing');
  assert(hasObject(data.horoscopeDetails), 'horoscopeDetails missing');
  assert(hasObject(data.chart), 'chart missing');
  assert(hasObject(data.houseChart), 'houseChart missing');
  assert(hasObject(data.navamsaChart), 'navamsaChart missing');
  assert(Array.isArray(data.aspects), 'aspects missing');
  assert(Array.isArray(data.yogas), 'yogas missing');
  assert(Array.isArray(data.doshas), 'doshas missing');
  assert(Array.isArray(data.remedies), 'remedies missing');

  const client = data.clientAstroRules;
  assert(hasObject(client.dashaBhuktiTemple), 'client dashaBhuktiTemple missing');
  assert(hasObject(client.jeevanadiDeity), 'client jeevanadiDeity missing');
  assert(hasObject(client.professionDeity), 'client professionDeity missing');
  assert(hasObject(client.clientKalaSarpa), 'clientKalaSarpa missing');
  assert(Array.isArray(client.rahuKetuAffectedPlanets), 'rahuKetuAffectedPlanets missing');
  assert(hasObject(client.pitruDosha), 'pitruDosha missing');
  assert(hasObject(client.nadiRules), 'nadiRules missing');

  const nadi = client.nadiRules;
  assert(nadi.totalPlannedRules === 60, `nadi totalPlannedRules expected 60, got ${nadi.totalPlannedRules}`);
  assert(nadi.implementedThroughRule === 60, `nadi implementedThroughRule expected 60, got ${nadi.implementedThroughRule}`);
  assert(nadi.evaluatedRuleCount === 60, `nadi evaluatedRuleCount expected 60, got ${nadi.evaluatedRuleCount}`);
  assert(nadi.pendingRuleCount === 0, `nadi pendingRuleCount expected 0, got ${nadi.pendingRuleCount}`);
  assert(Array.isArray(nadi.ruleResults) && nadi.ruleResults.length === 60,
    `nadi ruleResults expected 60, got ${nadi.ruleResults?.length}`);
  assert(Array.isArray(nadi.matchedRules), 'nadi matchedRules missing');
  assert(nadi.matchedRuleCount === nadi.matchedRules.length,
    'nadi matchedRuleCount does not equal matchedRules.length');

  const ruleNos = nadi.ruleResults.map((r) => r.ruleNo);
  assert(new Set(ruleNos).size === 60, 'nadi rule numbers are not unique');
  for (let i = 1; i <= 60; i++) {
    assert(ruleNos.includes(i), `nadi rule ${i} missing`);
  }

  assert(typeof client.clientKalaSarpa.result === 'boolean', 'clientKalaSarpa.result must be boolean');
  assert(typeof client.pitruDosha.result === 'boolean', 'pitruDosha.result must be boolean');
}

const cases = [
  {
    name: 'R1 - 1975 Karaikudi baseline / negative client Kala Sarpa / positive Pitru',
    payload: {
      birthDate: '1975-12-16',
      birthTime: '23:28',
      place: 'Karaikudi, Tamil Nadu, India',
      gender: 'male',
      language: 'ta',
    },
    extra(data) {
      assert(data.clientAstroRules.clientKalaSarpa.result === false,
        '1975 baseline clientKalaSarpa should be false');
      assert(data.clientAstroRules.pitruDosha.result === true,
        '1975 baseline pitruDosha should be true');
      assert(data.clientAstroRules.pitruDosha.matchedRules.some((r) => r.ruleNo === 3),
        '1975 baseline should include Pitru Rule 3');
    },
  },
  {
    name: 'R2 - 1982 Karaikudi same-Rasi Rahu joint Kala Sarpa case',
    payload: {
      birthDate: '1982-07-25',
      birthTime: '05:30',
      place: 'Karaikudi, Tamil Nadu, India',
      gender: 'male',
      language: 'ta',
    },
    extra(data) {
      assert(data.clientAstroRules.clientKalaSarpa.result === true,
        '1982 same-Rasi joint case clientKalaSarpa should be true');
    },
  },
  {
    name: 'R3 - 1973 Karaikudi pure enclosure Kala Sarpa case',
    payload: {
      birthDate: '1973-03-10',
      birthTime: '05:30',
      place: 'Karaikudi, Tamil Nadu, India',
      gender: 'male',
      language: 'ta',
    },
    extra(data) {
      assert(data.clientAstroRules.clientKalaSarpa.result === true,
        '1973 enclosure case clientKalaSarpa should be true');
    },
  },
  {
    name: 'R4 - 1984 Chennai negative Pitru case',
    payload: {
      birthDate: '1984-04-15',
      birthTime: '06:30',
      place: 'Chennai, Tamil Nadu, India',
      gender: 'male',
      language: 'ta',
    },
    extra(data) {
      assert(data.clientAstroRules.pitruDosha.result === false,
        '1984 Chennai pitruDosha should be false');
    },
  },
  {
    name: 'R5 - 1978 Trichy female positive Pitru case',
    payload: {
      birthDate: '1978-08-05',
      birthTime: '09:45',
      place: 'Trichy, Tamil Nadu, India',
      gender: 'female',
      language: 'ta',
    },
    extra(data) {
      assert(data.clientAstroRules.pitruDosha.result === true,
        '1978 Trichy pitruDosha should be true');
      assert(data.clientAstroRules.jeevanadiDeity.gender === 'female',
        'female Jeevanadi gender should remain female');
    },
  },
  {
    name: 'R6 - English language smoke/regression test',
    payload: {
      birthDate: '1975-12-16',
      birthTime: '23:28',
      place: 'Karaikudi, Tamil Nadu, India',
      gender: 'male',
      language: 'en',
    },
    extra(data) {
      assert(data.input.language === 'en', 'English request language not preserved');
      assert(data.lagna && typeof data.lagna.rasi === 'string', 'English lagna output missing');
    },
  },
];

(async () => {
  console.log('============================================================');
  console.log('FULL HOROSCOPE API REGRESSION TEST');
  console.log(`API: http://${API_HOST}:${API_PORT}${API_PATH}`);
  console.log('============================================================');

  let passed = 0;
  let failed = 0;

  for (const tc of cases) {
    process.stdout.write(`\n${tc.name}\n`);
    try {
      const res = await postJson(tc.payload);
      assert(res.statusCode === 200, `HTTP ${res.statusCode}: ${JSON.stringify(res.body).slice(0, 300)}`);
      validateCommonApiShape(res.body);
      tc.extra(res.body);
      console.log('PASS');
      passed++;
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      failed++;
    }
  }

  console.log('\n============================================================');
  console.log(`TOTAL PASS : ${passed}`);
  console.log(`TOTAL FAIL : ${failed}`);
  console.log('============================================================');

  if (failed === 0) {
    console.log('FULL API REGRESSION: PASS');
    process.exit(0);
  }

  console.log('FULL API REGRESSION: FAIL');
  process.exit(1);
})();
