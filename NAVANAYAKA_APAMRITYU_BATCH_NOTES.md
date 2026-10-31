# Navanayaka + Apamrityu API incremental validation batch

Source baseline: horoscope_api(20261031-155523).zip

## Changes
- Navanayaka uses birthplace latitude/longitude to determine the weekday at the last local sunrise preceding an ingress. With no coordinates, weekday assignment is null / LOCATION_REQUIRED, not an invented civil-day assignment.
- Horoscope generate route passes already resolved birthplace coordinates into Navanayaka; all other horoscope and chart computations are untouched.
- Apamrityu D1 comparison adds actualDegreeDms, referenceDegreeDms and deviationDms, rounded to the nearest arcminute. Preserves existing numerical properties, 10 x 12 reference matrix and UNVERIFIED classification.
- Dedicated test suite expanded to seven tests, including a worked comparison from client sample 20°13′ vs 23°00′ = 2°47′.

## Unresolved / do not deploy as fully verified
- Raja (Chaitra Shukla Pratipada sunrise) not calculated.
- Solar positions use an approximate Lahiri ayanamsa; no independent almanac year-by-year validation yet.
- Existing birthYear / nextYear / analysisYear are Gregorian year labels, not verified Tamil solar-year spans.
- Client PDF does not give a general formula for Subam / Asubam or personalized prognosis. No classification is asserted.

## Testing
- `node --test tests/clientNewReferenceReports.test.js`: 7/7 pass in build environment.
- Full `node --test tests/*.test.js`: 57/58 pass. One existing geocoding-dependent HTTP regression fails when Nominatim DNS unavailable (`EAI_AGAIN nominatim.openstreetmap.org`). No tests were weakened to hide this.
- Run full regression in Windows with `npm start` running and network access.

References for convention: https://www.drikpanchang.com/festivals/samvat-newyear/info/about-new-samvata-mantri-mandala.html and https://panchangtime.com/about/mantri-mandala
