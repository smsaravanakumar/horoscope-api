# API chart calculations — 15 October 2026

Authoritative input: horoscope_api(20261015-180655).zip.
API-only batch. Nothing deployed; no Flutter files changed.

## Audit and changes
| Requirement | Existing source | This batch |
|---|---|---|
| Mudakku | horoscopeDetails.mudakku | Reused unchanged |
| Yogi / Avayogi | horoscopeDetails.yogiAvayogi | Reused unchanged |
| D60 | Frozen d1D60Analysis uses longitude × 60 | Preserved; separate Astro-Vision-method chart added |
| Navamsa | navamsaChart returns names | Preserved; structured positions and D9 degrees added |
| Highest-D9-degree Lagna | Missing | Added as explicit client rule |
| Traditional Karakamsa | Missing | Separate reference result added |
| Thithi Soonya | Missing | Added from birth Tithi using a documented lookup |

New root JSON block: `clientChartCalculations`.
Existing response keys and calculations remain unchanged. In particular, do not treat the frozen D1-D60 chart and new shashtiamsa chart as interchangeable: they intentionally retain different conventions.

## Response contract
- `navamsaDetails`: division, method, lagna, planets, chart (12 sign keys).
- `shashtiamsa`: new D60 chart, lagna, planets, method and source.
- `karakamsa`: client's highest transformed D9 sign-degree reference Lagna.
- `traditionalKarakamsa`: highest natal sign-degree planet's D9 sign, for comparison.
- `thithiSoonyaRasi`: evaluated, tithiNumber (1–30), pakshaNumber (1–15), rasiNumbers, localized rasis, convention.
- `mudakkuRasi`, `yogiAvayogi`: existing API values reused.
- `rasiChartIndicators.signs`: sign-keyed arrays of indicators; overlaps retained. Yogi/Avayogi markers refer to the occupied natal sign of the API-designated planet, not the Yogi point itself.

Structured positions include natalLongitude, natalDegreeInSign, natalDegreeDms, transformed longitude, rasiNo, localized rasi, degreeInSign and degreeDms (degree/minute/second/text). Degrees in the new D9 output are transformed D9 degrees, not copied natal degrees. Both are returned explicitly. Numeric precision is used for comparisons; display seconds are truncated and never rounded into the next sign.

## Conventions and limits
### D60
Count half-degree segments forward from the body's natal sign. Segment is floor(natal degree within sign × 2); add that zero-based offset to the natal sign, wrapping after 12. Fractional segment progress is scaled to 0–30 degrees for display.
This follows Astro-Vision's published rule and matches all 11 positions in its public sample. It is not a claim of matching every software version or ephemeris setting. Precise birth time remains important.
The frozen client-supplied D60 nature/name table is not rewritten or reinterpreted.

### Client's D9 reference Lagna
Rank Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn by full-precision transformed degree within D9 sign. The selected planet's D9 sign becomes the reference Lagna. Return each planet's houseFromReferenceLagna without moving any planet or replacing the ordinary Lagna.
Default eligibility is seven planets, consistent with the seven-karaka public reference. Rahu, Ketu, Mandi/Gulika and Lagna are excluded. This is an explicit implementation assumption, not an instruction confirmed by the client. Retrograde degrees are not reversed. A full-precision tie returns evaluated:false plus candidates instead of choosing arbitrarily; missing/duplicate classical planets also return evaluated:false.
The requested D9-ranking rule is custom and is NOT labelled Astro-Vision-equivalent. The separate traditionalKarakamsa ranks natal sign degrees; the published sample produces Mars/Aquarius there, while the custom rule produces Mercury/Capricorn.

### Thithi Soonya / Dagdha Rasi
Use birth tithi, not the current day's tithi. Same lookup for both pakshas. Chaturdashi uses all four signs (Gemini, Virgo, Sagittarius, Pisces); Purnima and Amavasya have no signs. Other schools split the table by paksha; that alternative is not enabled. Invalid/missing Tithi returns evaluated:false, distinguishable from a valid empty result.
The full mapping is encoded in SHOONYA in the new service and exercised for all 30 lunar days. The public Astro-Vision Navami example matches Leo/Scorpio. The complete table has not been cross-validated against 30 Astro-Vision reports.

## References inspected
1. Astro-Vision D60 calculation rule: https://blog.indianastrologysoftware.com/sashtiamsa-d60/
2. Astro-Vision LifeSign sample: https://astrology.mathrubhumi.com/horoscopes/horoscope-samples/superhoroscope-eng12.5.pdf — printed pages 3–4, 11 and 13: input longitudes, Dagdha Rasi, seven karakas, D9/D60 results.
3. Practitioner's Thithi Shoonya table: https://drrpsharma.com/blog/tithi-shoonya-dosha.html
4. Cross-check table: https://vjgoel.blogspot.com/2013/08/dagdha-rashis-and-yoga.html

## Install and test (PowerShell in folder containing server.js and package.json)
Back up current source. Extract the modified-only archive into that API root, replacing routes/horoscope.js and adding the other files. The nested old horoscope_api folder in the uploaded archive is not the active application root and is not patched.

```powershell
npm ci
powershell -ExecutionPolicy Bypass -File .\Run-ChartCalculations-UAT.ps1
```
The script stops on failures. Review API_CHART_UAT_REPORT.txt.
Optional baseline response comparison before deploying:
```powershell
$env:API_BASELINE_ROOT = 'D:\Your-Unmodified-API-Backup'
node tests/clientChartCalculationsApiIntegration.test.js
Remove-Item Env:\API_BASELINE_ROOT
```
The path must be the original API root containing routes/horoscope.js and installed dependencies. Test dates and coordinates are synthetic/fixed; the external geocoder is deliberately blocked.

## Deployment
After passing local tests, commit the provided new/modified files in the existing API repository and use your established Render deployment workflow. No new environment variables or dependencies are required. This delivery does not itself update GitHub or Render.
Full source ZIP excludes dependencies, Git history, local environment/credential files and the stale nested copy. Keep existing Render environment configuration.

## Flutter follow-up
This batch only calculates and returns API data. Existing Flutter builds continue using old fields. A later Flutter patch must consume the new degree rows and thithiSoonyaRasi/indicators to show them; the previously supplied chart-style ZIP does not automatically read this new block.
