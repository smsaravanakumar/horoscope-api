const http = require('http');

const API_URL = 'http://localhost:3000/api/horoscope/generate';

const samples = [
  {
    id: 'S1', birthDate: '16-03-2001', birthTime: '07:30 PM', place: 'Kanniyakumari',
    expected: { yogiPlanet: 'செவ்வாய்', yogiStar: 'அவிட்டம்', avayogiPlanet: 'கேது', avayogiStar: 'மகம்' }
  },
  {
    id: 'S2', birthDate: '04-04-1971', birthTime: '07:52 AM', place: 'Tirunelveli',
    expected: { yogiPlanet: 'செவ்வாய்', yogiStar: 'அவிட்டம்', avayogiPlanet: 'கேது', avayogiStar: 'மகம்' }
  },
  {
    id: 'S3', birthDate: '19-05-1999', birthTime: '03:03 PM', place: 'Chennai',
    expected: { yogiPlanet: 'சனி', yogiStar: 'அனுஷம்', avayogiPlanet: 'சந்திரன்', avayogiStar: 'ரோகிணி' }
  },
  {
    id: 'S4', birthDate: '17-09-1982', birthTime: '06:10 AM', place: 'Madurai',
    expected: { yogiPlanet: 'சூரியன்', yogiStar: 'கிருத்திகை', avayogiPlanet: 'சனி', avayogiStar: 'அனுஷம்' }
  },
  {
    id: 'S5', birthDate: '26-06-1988', birthTime: '10:10 AM', place: 'Chennai',
    expected: { yogiPlanet: 'கேது', yogiStar: 'அஸ்வினி', avayogiPlanet: 'ராகு', avayogiStar: 'சுவாதி' }
  }
];

function postJson(urlString, payload) {
  const url = new URL(urlString);
  const body = JSON.stringify(payload);
  const options = {
    hostname: url.hostname,
    port: url.port || 80,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode < 200 || res.statusCode >= 300 || parsed.success === false) {
            reject(new Error(parsed.message || `HTTP ${res.statusCode}`));
            return;
          }
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Invalid API response: ${error.message}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function mark(expected, actual) {
  return expected === actual ? 'MATCH' : 'CHECK';
}

(async () => {
  console.log('YOGI / AVAYOGI CONVENTION DIAGNOSTIC');
  console.log(`API: ${API_URL}`);
  console.log('This script does not modify any project file.');
  console.log('='.repeat(78));

  for (const sample of samples) {
    try {
      const result = await postJson(API_URL, {
        name: 'Validation User',
        gender: 'male',
        birthDate: sample.birthDate,
        birthTime: sample.birthTime,
        place: sample.place,
        language: 'ta'
      });

      const details = result.horoscopeDetails || {};
      const yoga = details.panchangaYoga || {};
      const current = details.yogiAvayogi || {};
      const yogi = current.yogi || {};
      const avayogi = current.avayogi || {};

      console.log(`\n${sample.id}: ${sample.birthDate}, ${sample.birthTime}, ${sample.place}`);
      console.log('-'.repeat(78));
      console.log(`Panchanga Yoga   : ${yoga.number || '-'} - ${yoga.name || '-'} (${yoga.longitude ?? '-'})`);
      console.log(`Expected Yogi    : ${sample.expected.yogiPlanet} / ${sample.expected.yogiStar}`);
      console.log(`Current Yogi     : ${yogi.planet || '-'} / ${yogi.nakshatra || '-'}  ${mark(sample.expected.yogiPlanet, yogi.planet)} planet, ${mark(sample.expected.yogiStar, yogi.nakshatra)} star`);
      console.log(`Expected Avayogi : ${sample.expected.avayogiPlanet} / ${sample.expected.avayogiStar}`);
      console.log(`Current Avayogi  : ${avayogi.planet || '-'} / ${avayogi.nakshatra || '-'}  ${mark(sample.expected.avayogiPlanet, avayogi.planet)} planet, ${mark(sample.expected.avayogiStar, avayogi.nakshatra)} star`);
      console.log(`Method           : ${current.calculationMethod || '-'}`);
    } catch (error) {
      console.log(`\n${sample.id}: ERROR - ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(78));
  console.log('Copy the complete output and send it for final Yogi/Avayogi mapping analysis.');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
