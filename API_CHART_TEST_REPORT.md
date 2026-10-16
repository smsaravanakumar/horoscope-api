# Execution report

Executed locally with Node.js; no deployment performed.
- New calculation tests: 9/9 PASS, including 11 Astro-Vision sample D60 positions, 11 D9 sample positions, all 30 tithis, custom vs traditional ranking, boundaries, ties, exclusions and localization.
- New HTTP tests: Tamil and English PASS.
- Every old response field deep-compared to the latest uploaded baseline: PASS in both languages (transit time fixed for reproducibility).
- Frozen full regression: 20/20 suites PASS.
- Birth calculation unit suite: PASS.
- Birth calculation integration: 10/10 PASS.
- Coordinate bypass: 6/6 PASS.
- PowerShell runner supplied but not executed on Windows here; its individual Node suites were executed here.
- No Astro-Vision application session was run; comparison used its published sample longitudes and sign table. No Render verification/deployment performed.


## api_integration.log
```text
PASS ta: HTTP response, D9 positions, D60, Karakamsa, Thithi Soonya, existing values
PASS ta: ALL previous response fields deep-equal latest uploaded baseline
PASS en: HTTP response, D9 positions, D60, Karakamsa, Thithi Soonya, existing values
PASS en: ALL previous response fields deep-equal latest uploaded baseline
```

## api_regression.log
```text

ASHTAKAVARGA API INTEGRATION UAT: PASS

SUITE PASS: ashtakavargaApiIntegration.test.js

========================================================================
API STEP 5D - FINAL REGRESSION SUMMARY
========================================================================
TOTAL SUITES : 20
SUITES PASS  : 20
SUITES FAIL  : 0

API STEP 5D FULL REGRESSION/UAT: PASS
All completed/frozen deterministic UAT suites passed.
```

## api_birth_unit.log
```text
birthCalculationDetails.test.js: PASS
```

## api_birth_http.log
```text
PASS: New birthCalculationDetails block is present
PASS: Thirukanitha sunrise/sunset match client reference minute values
PASS: Udayadhi Nazhigai matches client reference
PASS: Aadi-Antham Nakshatra duration is returned
PASS: Planetary table is returned in client display order
PASS: Reference planetary longitudes are exposed as D:M:S
PASS: Nakshatra lord and relationship/status are exposed
PASS: Current Dasha/Bhukti end dates are exposed
PASS: Existing frozen blocks remain present

TOTAL PASS : 10
TOTAL FAIL : 0

BIRTH CALCULATION DETAILS API UAT: PASS
```

## api_coords.log
```text
PASS: Explicit coordinates bypass external geocoder
PASS: API success remains true
PASS: Response returns supplied latitude/longitude
PASS: Ashtakavarga remains correct
PASS: Mole/Scar analysis remains present
PASS: Latitude without longitude is rejected

TOTAL PASS : 6
TOTAL FAIL : 0

RENDER COORDINATE BYPASS UAT: PASS
```
