const { spawnSync } = require('child_process');
const path = require('path');

/**
 * API Step 5D - Full Regression / UAT runner
 *
 * Purpose:
 * - Runs the completed/frozen deterministic UAT suites in one command.
 * - Includes HTTP-level Mole/Scar and Ashtakavarga integration UAT.
 * - Does NOT modify or mock production code globally.
 * - Leaves the older fullApiRegression.test.js untouched because that legacy
 *   test expects a separately running API on localhost:3000.
 */

const TESTS = [
  'panchaPakshi.test.js',
  'gocharam.test.js',
  'mandiDosha.test.js',

  'yogaRules01to10.test.js',
  'yogaRules11to20.test.js',
  'yogaRules21to30.test.js',
  'yogaRules31to40.test.js',

  'nadiRules01to10.test.js',
  'nadiRules11to20.test.js',
  'nadiRules21to30.test.js',
  'nadiRules31to40.test.js',
  'nadiRules41to50.test.js',
  'nadiRules51to60.test.js',

  'd1D60Foundation.test.js',
  'd1D60Extended.test.js',

  'moleScarRuleMaster.test.js',
  'moleScarAnalysis.test.js',
  'moleScarApiIntegration.test.js',

  'ashtakavarga.test.js',
  'ashtakavargaApiIntegration.test.js',
];

const testsDir = __dirname;
let passedSuites = 0;
let failedSuites = 0;
const failures = [];

console.log('='.repeat(72));
console.log('API STEP 5D - FULL REGRESSION / UAT');
console.log('='.repeat(72));
console.log(`Test suites scheduled: ${TESTS.length}`);
console.log('');

for (const testFile of TESTS) {
  const fullPath = path.join(testsDir, testFile);

  console.log('-'.repeat(72));
  console.log(`RUN: ${testFile}`);
  console.log('-'.repeat(72));

  const result = spawnSync(process.execPath, [fullPath], {
    cwd: path.resolve(testsDir, '..'),
    encoding: 'utf8',
    stdio: 'pipe',
    env: process.env,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status === 0) {
    passedSuites += 1;
    console.log(`\nSUITE PASS: ${testFile}\n`);
  } else {
    failedSuites += 1;
    failures.push({
      testFile,
      exitCode: result.status,
      signal: result.signal,
    });
    console.log(`\nSUITE FAIL: ${testFile} (exit ${result.status})\n`);
  }
}

console.log('='.repeat(72));
console.log('API STEP 5D - FINAL REGRESSION SUMMARY');
console.log('='.repeat(72));
console.log(`TOTAL SUITES : ${TESTS.length}`);
console.log(`SUITES PASS  : ${passedSuites}`);
console.log(`SUITES FAIL  : ${failedSuites}`);

if (failures.length > 0) {
  console.log('\nFAILED SUITES:');
  for (const failure of failures) {
    console.log(`- ${failure.testFile} (exit ${failure.exitCode}${failure.signal ? `, signal ${failure.signal}` : ''})`);
  }
  console.log('\nAPI STEP 5D FULL REGRESSION/UAT: FAIL');
  process.exitCode = 1;
} else {
  console.log('\nAPI STEP 5D FULL REGRESSION/UAT: PASS');
  console.log('All completed/frozen deterministic UAT suites passed.');
}
