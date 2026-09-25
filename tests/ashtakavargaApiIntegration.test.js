const http = require('http');
const express = require('express');

const clientReference = require('../data/ashtakavargaClientReference.json');

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
  // Stub only the external geocoder so this HTTP UAT remains deterministic.
  // These are the Kanniyakumari coordinates used for the client reference case.
  const geocodePath = require.resolve('../services/geocodeService');
  const originalGeocodeModule = require(geocodePath);

  require.cache[geocodePath].exports = {
    ...originalGeocodeModule,
    getCoordinates: async () => ({
      latitude: 8.3279814,
      longitude: 77.3541173,
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
        name: 'Ashtakavarga Client UAT',
        gender: 'male',
        birthDate: '04-04-1971',
        birthTime: '7:52 AM',
        place: 'Kanniyakumari',
        language: 'ta',
      },
    });

    check('HTTP /api/horoscope/generate returns 200', () => {
      assert(response.statusCode === 200,
        `Expected 200, got ${response.statusCode}: ${JSON.stringify(response.body).slice(0, 500)}`);
    });

    const data = response.body;

    check('Existing API success response remains true', () => {
      assert(data.success === true, 'success must be true');
    });

    check('Existing frozen horoscope blocks are still present', () => {
      assert(data.lagna && typeof data.lagna === 'object', 'lagna missing');
      assert(Array.isArray(data.planets) && data.planets.length >= 10, 'planets missing');
      assert(data.chart && typeof data.chart === 'object', 'chart missing');
      assert(data.navamsaChart && typeof data.navamsaChart === 'object', 'navamsaChart missing');
      assert(data.clientAstroRules && typeof data.clientAstroRules === 'object', 'clientAstroRules missing');
      assert(data.currentGocharam && typeof data.currentGocharam === 'object', 'currentGocharam missing');
      assert(data.moleScarAnalysis && typeof data.moleScarAnalysis === 'object', 'moleScarAnalysis missing');
    });

    check('ashtakavarga is returned as a top-level API block', () => {
      assert(data.ashtakavarga && typeof data.ashtakavarga === 'object', 'ashtakavarga missing');
      assert(data.ashtakavarga.evaluated === true, 'ashtakavarga.evaluated must be true');
      assert(data.ashtakavarga.type === 'bhinnashtakavarga',
        `unexpected ashtakavarga.type: ${data.ashtakavarga.type}`);
    });

    check('Client Ashtakavarga matrix matches all 12 rows exactly', () => {
      assert(JSON.stringify(data.ashtakavarga.rows) === JSON.stringify(clientReference.rows),
        `matrix mismatch\nExpected: ${JSON.stringify(clientReference.rows)}\nActual:   ${JSON.stringify(data.ashtakavarga.rows)}`);
    });

    check('Client planet totals match exactly', () => {
      assert(JSON.stringify(data.ashtakavarga.planetTotals) ===
        JSON.stringify(clientReference.checksums.planetTotals),
      `planetTotals mismatch: ${JSON.stringify(data.ashtakavarga.planetTotals)}`);
    });

    check('Client grand total is 337', () => {
      assert(data.ashtakavarga.grandTotal === clientReference.checksums.grandTotal,
        `expected ${clientReference.checksums.grandTotal}, got ${data.ashtakavarga.grandTotal}`);
      assert(data.ashtakavarga.grandTotal === 337,
        `classical grand total expected 337, got ${data.ashtakavarga.grandTotal}`);
    });

    check('Ashtakavarga uses seven classical planets plus Lagna contributors', () => {
      assert(JSON.stringify(data.ashtakavarga.planetOrder) ===
        JSON.stringify(['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn']),
      `unexpected planetOrder: ${JSON.stringify(data.ashtakavarga.planetOrder)}`);
      assert(JSON.stringify(data.ashtakavarga.contributorOrder) ===
        JSON.stringify(['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'lagna']),
      `unexpected contributorOrder: ${JSON.stringify(data.ashtakavarga.contributorOrder)}`);
    });

    console.log('\nAshtakavarga contributor Rasis:', data.ashtakavarga.contributorRasis);
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

  console.log('\nASHTAKAVARGA API INTEGRATION UAT: PASS');
}

main().catch((error) => {
  console.error('ASHTAKAVARGA API INTEGRATION UAT: FAIL');
  console.error(error);
  process.exitCode = 1;
});
