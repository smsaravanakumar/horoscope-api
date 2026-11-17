# Gocharam Dasha / Bhukti / Antaram — API candidate

Baseline: horoscope_api(20261117-131855).zip. Only the new service, route and tests change.

## Convention implemented
Client specified Thirukanitha, 120-year Vimshottari, birth input, transit Moon Nakshatra,
and automatic current date/time. The working interpretation is to seed the birth-anchored
timeline using the transit Moon's sidereal longitude, including its traversed Nakshatra
fraction. Evaluate the timeline at the same UTC instant as the Gocharam chart. The existing
365.25-day-year convention, period order and proportional subdivisions are reused unchanged.
This is a mathematically tested interpretation, not independently confirmed against the
client's sample dates. Obtain one fixed-date reference result before final client acceptance.

Response: clientDashaPeriods.gocharam contains evaluated, calculationMethod, convention,
referenceIsoUtc, birthAnchorIsoUtc, cycleYears, referenceMoon and currentDasha/currentBhukti/
currentAntaram (key, localized name, IST start/end dates, UTC start/end timestamps).
Natal fields and existing calculations are unchanged. No Flutter change in this batch.

## Local verification
Targeted unit and HTTP integration tests: 6/6 PASS. All self-contained tests: 69/69 PASS.
The separate fullApiRegression.test.js requires the running API and external geocoding;
run it on the Windows development system before staging.

## Windows commands
In one PowerShell terminal: `node server.js`.
In another: `node --test tests/*.test.js`, then `npm audit`.
Inspect `git status --short` and stage only the 4 files in this package.
Deploy only after review and run the production smoke UAT. Compare one fixed-date example
with the client's expected Gocharam Dasha/Bhukti/Antaram before freezing this calculation.
