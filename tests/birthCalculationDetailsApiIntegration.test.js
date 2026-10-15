const http = require('http');
const express = require('express');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function postJson({ port, pathName, payload }) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: pathName,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 30000,
      },
      (res) => {
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
      }
    );
    req.on('timeout', () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const geocodePath = require.resolve('../services/geocodeService');
  const originalGeocodeModule = require(geocodePath);
  require.cache[geocodePath].exports = {
    ...originalGeocodeModule,
    getCoordinates: async () => {
      throw new Error('TEST FAILURE: external geocoder must not be called');
    },
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
      port: server.address().port,
      pathName: '/api/horoscope/generate',
      payload: {
        name: 'Chakrapani Reference',
        gender: 'male',
        birthDate: '02-07-1969',
        birthTime: '04:05 PM',
        place: 'Sirkazhi, Tamil Nadu, India',
        latitude: 11.65,
        longitude: 78.1666666667,
        language: 'ta',
      },
    });

    check('Reference request returns 200', () => {
      assert(response.statusCode === 200,
        `Expected 200, got ${response.statusCode}: ${JSON.stringify(response.body).slice(0, 500)}`);
    });
    check('New birthCalculationDetails block is present', () => {
      assert(response.body.birthCalculationDetails, 'birthCalculationDetails missing');
    });
    check('Thirukanitha sunrise/sunset match client reference minute values', () => {
      assert(response.body.birthCalculationDetails.sunrise.timeIst === '05:57', 'sunrise mismatch');
      assert(response.body.birthCalculationDetails.sunset.timeIst === '18:45', 'sunset mismatch');
    });
    check('Udayadhi Nazhigai matches client reference', () => {
      assert(response.body.birthCalculationDetails.udayadhiNazhigai.text === '25.20',
        `Expected 25.20, got ${response.body.birthCalculationDetails.udayadhiNazhigai.text}`);
    });
    check('Aadi-Antham Nakshatra duration is returned', () => {
      const value = response.body.birthCalculationDetails.aadiAnthamNazhigai;
      assert(value.nazhigai === 54, `Expected 54.xx, got ${value.text}`);
      assert(value.vinadi >= 40 && value.vinadi <= 55, `Unexpected value ${value.text}`);
    });
    check('Planetary table is returned in client display order', () => {
      const keys = response.body.birthCalculationDetails.planetaryTable.map((row) => row.key);
      assert(keys.join(',').startsWith('lagna,sun,moon,mars,mercury,jupiter,venus,saturn,rahu,ketu'),
        `Unexpected order: ${keys.join(',')}`);
    });
    check('Reference planetary longitudes are exposed as D:M:S', () => {
      const rows = Object.fromEntries(
        response.body.birthCalculationDetails.planetaryTable.map((row) => [row.key, row])
      );
      assert(rows.lagna.longitudeDms.text === '221:11:02', 'Lagna DMS mismatch');
      assert(rows.sun.longitudeDms.text === '76:55:24', 'Sun DMS mismatch');
      assert(rows.moon.longitudeDms.text === '293:53:45', 'Moon DMS mismatch');
      assert(rows.mars.longitudeDms.text === '218:30:11', 'Mars DMS mismatch');
    });
    check('Nakshatra lord and relationship/status are exposed', () => {
      const mars = response.body.birthCalculationDetails.planetaryTable.find((row) => row.key === 'mars');
      const mercury = response.body.birthCalculationDetails.planetaryTable.find((row) => row.key === 'mercury');
      assert(mars.nakshatraLord?.name, 'Mars Nakshatra lord missing');
      assert(mars.relationship?.text === 'ஆட்சி', 'Mars status mismatch');
      assert(mercury.relationship?.text === 'நட்பு', 'Mercury relationship mismatch');
    });
    check('Current Dasha/Bhukti end dates are exposed', () => {
      const timeline = response.body.birthCalculationDetails.dashaTimeline;
      assert(/^\d{2}-\d{2}-\d{4}$/.test(timeline.currentDasha.endDate), 'Dasha end date missing');
      assert(/^\d{2}-\d{2}-\d{4}$/.test(timeline.currentBhukti.endDate), 'Bhukti end date missing');
    });
    check('Existing frozen blocks remain present', () => {
      assert(response.body.horoscopeDetails, 'horoscopeDetails missing');
      assert(response.body.navamsaChart, 'navamsaChart missing');
      assert(response.body.ashtakavarga, 'ashtakavarga missing');
      assert(response.body.moleScarAnalysis, 'moleScarAnalysis missing');
    });
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
  console.log('\nBIRTH CALCULATION DETAILS API UAT: PASS');
}

main().catch((error) => {
  console.error('BIRTH CALCULATION DETAILS API UAT: FAIL');
  console.error(error);
  process.exitCode = 1;
});
