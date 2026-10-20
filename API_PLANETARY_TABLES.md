# API planetary tables — 20 October 2026

Baseline: horoscope_api(20261020-154508).zip (outer project; nested backup excluded).

New arrays:
- clientChartCalculations.navamsaDetails.planetaryTable
- clientChartCalculations.shashtiamsa.planetaryTable
- clientChartCalculations.karakamsa.planetaryTable
- currentGocharam.planetaryTable

Each row: key, name, longitude, longitudeDms (absolute 0–360 longitude), degreeInSign, degreeDms (0–30 degree within sign), nakshatra, pada, nakshatraLord {key,name}, rasi, rasiNo, relationship {key,text}, retrograde.
Flutter should use degreeDms.text for chart/table sign degrees. The existing Rasi table is untouched.

D9/D60 star, pada, lord and status describe transformed divisional positions, using existing enrichment and relationship conventions. They are not natal star values. Physical combustion results are not exposed in these tables. Retrograde is retained from original bodies.
Karakamsa table equals D9 planet rows, excluding ordinary Lagna. Reference Lagna remains the existing sign-only value; no ascendant longitude is fabricated. Check karakamsa.evaluated before rendering its chart/table as a selected reference chart.
Gocharam uses its existing current-time positions. Existing fields, charts, remedy rules and package dependencies are unchanged.

Validation executed:
- New table unit tests: 2 passed.
- New HTTP integration: Tamil/English table fields and D9/Karakamsa equivalence passed.
- Full response comparison against uploaded baseline: removing only four new table arrays leaves every previous field deep-equal, Tamil and English, fixed clock and coordinates.
- Existing chart unit/integration, 20-suite regression, birth-detail unit/integration and coordinate-bypass tests passed. Full log: API_TABLES_TEST_REPORT.txt.

Known inherited limitation: the existing pada helper can return the preceding pada at exact floating-point boundaries (for example longitude 40 degrees). This frozen helper was not changed. The new tables preserve its convention; this boundary issue requires a separate approved correction if needed. This does not imply arbitrary real-birth calculations have been independently verified against external software.

Windows commands, from D:\horoscope_api:
```
npm ci
powershell -ExecutionPolicy Bypass -File .\Run-ChartCalculations-UAT.ps1
```
The runner now includes both new tests and all prior suites. Back up the project and overlay the modified-only ZIP's horoscope_api contents into the project root. No dependency changes are required.

UAT: generate Tamil/English; verify the four arrays, D9/D60 signs against their chart bodies, Karakamsa planets equal D9, Gocharam uses its dateTimeUtc, and existing Rasi/remedy sections remain present. Flutter display integration is a separate next task. Render deployment has not been performed.
