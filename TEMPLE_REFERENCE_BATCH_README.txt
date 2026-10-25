PANJAPAKSHI HOROSCOPE API — INTEGRATED TEMPLE REFERENCE BATCH
Date: 2026-10-25
Source baseline: horoscope_api(20261025-042559).zip (post npm audit fix)

One delivery covers A02 + A03 + A04 reference-service foundation and UAT.

Implemented:
 - Nakshatra Yogi/Avayogi reference: 27 pairs, both columns, temple/town/district (Tamil source names).
 - Mudakku rasi: seven planetary groups / 12 house tables from the four-page client PDF; these are mapped as 144 rasi-house entries for all 12 signs according to paired signs in the PDF headings.
 - 12 Mudakku temple house options exposed to clientTempleReferences for the calculated Mudakku Rasi. No personalized house is guessed.
 - Optional explicit house number supported inside the service (not automatically supplied by the generation API).
 - Tamil and English API modes work: English returns original Tamil proper nouns, marked originalLanguage=ta rather than unapproved/incorrect romanization.
 - Existing original astrology and birth-weekday calculation services unchanged.
 - Source coverage tests and normal/invalid/boundary tests.
 - Full-source ZIP, change-only ZIP, a single PowerShell UAT runner.
 - TEMPLE_REFERENCE_REVIEW.csv: 27 Yogi/Avayogi source rows and 144 mapped Mudakku rows for proofreading.

Quality control notes / deployment gate:
 - Client PDF pages are image scans. All Tamil temple names, locations and districts have been manually transcribed in this batch. Source names may contain transcription errors and MUST be proofread against original scans by a Tamil-speaking reviewer before public publication. Tests validate structure, cardinality and selected reference records, not perfect spelling.
 - The reference document does NOT define which of the 12 Mudakku houses applies to a native. Hence the API supplies all twelve house choices and mudakkuHouseTemple remains null unless a house is explicitly passed to the reference service.
 - Do not treat temple locations as verified travel directions/current geographic coordinates.
 - English descriptions are not official translations; original Tamil nouns returned with explicit language marker.
 - Full backend suite was run using available preinstalled matching dependencies in the sandbox: 44 PASS, 1 FAIL. The only failure was the existing tests/fullApiRegression.test.js which calls Nominatim externally for geocoding; internet DNS is unavailable in the sandbox. All other tests, including API integration with explicit coordinates, passed. Rerun complete regression on the local Windows environment with functional geocoding.
 - This batch is ready for local UAT, NOT approved for Render deployment until client reference proofread and full local regression pass.

Files modified:
 data/clientYogiAvayogiTemples.json
 data/clientMudakkuHouseTemples.json
 services/clientTempleReferenceService.js
 routes/horoscope.js (comment only)
 tests/clientTempleReferenceService.test.js

Files added:
 Run-TempleReferences-Batch-UAT.ps1
 TEMPLE_REFERENCE_BATCH_README.txt
 TEMPLE_REFERENCE_REVIEW.csv

LOCAL INSTALL:
 1. Backup the complete D:\horoscope_api folder.
 2. Unzip MODIFIED_ONLY package; copy contents of its 'horoscope_api' folder into D:\horoscope_api, overwriting matching paths.
 3. In Windows PowerShell, change to D:\horoscope_api and run:
    powershell -ExecutionPolicy Bypass -File .\Run-TempleReferences-Batch-UAT.ps1
 4. Inspect TEMPLE_REFERENCE_BATCH_UAT_REPORT.txt; supply one consolidated result.

No APK build commands apply: this is an API-only batch.
