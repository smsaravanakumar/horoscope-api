PANJAPAKSHI API - Client Temple Reference Batch A01 (foundation; not complete)
Baseline: horoscope_api(20261025-032155).zip
Changes:
- New independent service clientTempleReferenceService.js
- Separate structured datasets for Yogi/Avayogi and Mudakku-house temple references
- Additive clientTempleReferences in horoscope generation JSON
- Three unit tests for safe missing-reference handling
Existing astrology calculation functions and existing API fields unchanged.

IMPORTANT: The PDF references are scanned tables. The entry arrays have intentionally been left empty until their temple/location text is transcribed and manually checked against the source pages. NO temple recommendation is currently emitted. The exact house-selection rule for personalized Mudakku temple selection is not yet defined. Do not deploy this as complete client-reference feature.

Tests run:
PASS node --test tests/clientTempleReferenceService.test.js (3/3)
PASS node --check routes/horoscope.js
Full suite node --test tests/*.test.js: 41 passed / 1 failed; failure from tests/fullApiRegression.test.js because its six HTTP checks require a live localhost:3000 server (not started by that suite). This is not claimed as a full regression pass.

Test commands:
cd horoscope_api
node --test tests/clientTempleReferenceService.test.js
node --test tests/*.test.js

Next phase: manually transcribe and independently verify PDF entries, determine house-selection rule, implement reference-coverage tests and only then enable temple recommendations. Preserve frozen calculations.
