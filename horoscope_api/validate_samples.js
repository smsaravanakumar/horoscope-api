const http = require('http');

const API_URL = 'http://localhost:3000/api/horoscope/generate';

const samples = [
  {
    id: 'S1',
    birthDate: '16-03-2001',
    birthTime: '07:30 PM',
    place: 'Kanniyakumari',
    expected: { lagna: '18.10°', mandi: '20.10°' },
  },
  {
    id: 'S2',
    birthDate: '04-04-1971',
    birthTime: '07:52 AM',
    place: 'Tirunelveli',
    expected: { lagna: '16.11°', mandi: '26.13°' },
  },
  {
    id: 'S3',
    birthDate: '19-05-1999',
    birthTime: '03:03 PM',
    place: 'Chennai',
    expected: { lagna: '16.11°', mandi: '28.08°' },
  },
  {
    id: 'S4',
    birthDate: '17-09-1982',
    birthTime: '06:10 AM',
    place: 'Madurai',
    expected: { lagna: '0.03°', mandi: '6.11°' },
  },
  {
    id: 'S5',
    birthDate: '26-06-1988',
    birthTime: '10:10 AM',
    place: 'Chennai',
    expected: { lagna: '11.32°', mandi: '17.06°' },
  },
];

function postJson(urlString, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const body = JSON.stringify(payload);

    const request = http.request(
      {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 60000,
      },
      (response) => {
        let responseBody = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          responseBody += chunk;
        });
        response.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            resolve({ statusCode: response.statusCode, data: parsed });
          } catch (error) {
            reject(
              new Error(
                `API returned non-JSON response (HTTP ${response.statusCode}): ${responseBody}`
              )
            );
          }
        });
      }
    );

    request.on('timeout', () => {
      request.destroy(new Error('API request timed out after 60 seconds'));
    });
    request.on('error', reject);
    request.write(body);
    request.end();
  });
}

function getPlanet(data, key) {
  return Array.isArray(data.planets)
    ? data.planets.find((planet) => planet.key === key)
    : undefined;
}

function printLine(label, expected, actual, extra = '') {
  const isMatch = expected === actual;
  const mark = isMatch ? 'MATCH' : 'CHECK';
  console.log(
    `${label.padEnd(10)} Expected: ${String(expected).padEnd(9)} Actual: ${String(actual).padEnd(9)} ${mark}${extra}`
  );
}

async function run() {
  console.log('HOROSCOPE SAMPLE VALIDATION');
  console.log('API:', API_URL);
  console.log('='.repeat(72));

  for (const sample of samples) {
    console.log(`\n${sample.id}: ${sample.birthDate}, ${sample.birthTime}, ${sample.place}`);
    console.log('-'.repeat(72));

    try {
      const result = await postJson(API_URL, {
        name: `Validation ${sample.id}`,
        gender: 'male',
        birthDate: sample.birthDate,
        birthTime: sample.birthTime,
        place: sample.place,
        language: 'ta',
      });

      if (result.statusCode !== 200 || !result.data.success) {
        console.log(
          `FAILED: HTTP ${result.statusCode} - ${result.data.message || 'Unknown API error'}`
        );
        continue;
      }

      const mandi = getPlanet(result.data, 'mandi');
      const lagna = result.data.lagna;

      printLine(
        'Lagna',
        sample.expected.lagna,
        lagna?.degreeMinute || 'missing',
        ` (${lagna?.rasi || 'unknown'})`
      );
      printLine(
        'Mandi',
        sample.expected.mandi,
        mandi?.degreeMinute || 'missing',
        ` (${mandi?.rasi || 'unknown'})`
      );

      console.log(`Coordinates: ${result.data.coordinates.latitude}, ${result.data.coordinates.longitude}`);
      console.log(`Ayanamsa: ${Number(result.data.ayanamsa).toFixed(6)}°`);
    } catch (error) {
      console.log(`FAILED: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(72));
  console.log('Copy the complete output and send it for Mandi formula validation.');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
