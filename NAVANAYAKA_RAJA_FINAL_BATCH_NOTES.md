# Navanayaka Raja calculation batch — 2026-10-31

## Input baseline
`horoscope_api(20261031-164206).zip` (user confirmed local 58/58 regression, 20/20 nested tests and npm audit 0).

## Changes
- `services/clientNavanayakaService.js`: additive `findRajaNewYear` finder for Chaitra Shukla Pratipada based on the sidereal Pisces new moon before Mesha Sankranti, astronomy-engine new moon/tithi and local sunrise. Handles standard udayavyapini, two-sunrise vriddhi and no-sunrise kshaya fallback with explicit determination labels. The Raja role is populated only if valid coordinates are provided. Astronomical ephemeris still uses the project's APPROXIMATE Lahiri ayanamsa: this is not a certified Panchang match.
- `tests/clientNewReferenceReports.test.js`: two new tests for 2026 kshaya and 2025 ordinary Pratipada (9/9 dedicated PASS).

## Reference / method limitations
- Year columns are Gregorian years, not fully verified Tamil calendar spans.
- In 2026 at latitude 8.73 / longitude 77.70, lunar new moon occurs March 19 UTC and no sunrise is inside Pratipada; prior sunrise is chosen provisionally (Thursday/Jupiter). Regional conventions and ayanamsa may differ; cross-check with independent published Thirukanitha Panchangam before production.
- No universal Apamrityu Bhaga `சுபம் / அசுபம்` classification is included. The source PDFs permit degree lookup and differences, **not** a sufficiently defined interpretation rule. The classification remains UNVERIFIED. No invented health/lifespan claims.
- Frozen astrology calculations and PDF export unchanged.

## Test evidence in this sandbox
- `node --test tests/clientNewReferenceReports.test.js`: 9 PASS / 0 FAIL.
- `node --test tests/*.test.js`: 59 PASS / 1 FAIL. The lone failure is the existing `fullApiRegression.test.js` using external geocoding (Nominatim DNS EAI_AGAIN in this sandbox), not Raja arithmetic. User should rerun with local server and network available.
- The original source contains the user's security-updated lockfile; no dependency versions modified in this batch.

## Windows UAT
Start `npm start` in one terminal, then in another:
```
cd D:\horoscope_api
node --test tests\clientNewReferenceReports.test.js
node --test tests\fullApiRegression.test.js
node --test tests\*.test.js
npm audit
```
Do NOT deploy until full tests and reference-year checks pass and you accept the limitations.
