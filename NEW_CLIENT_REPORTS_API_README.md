# Panjapakshi Horoscope API — Navanayaka and Amirthu Bhaga (Phase A01)

## Delivery state

This is an **API-first partial implementation**, not a fully verified prediction engine. Existing D1, D9, D60, temple, PDF, chart and astrological calculations remain unchanged. The two new top-level response objects are additive and do not require changing request payloads.

- `clientNavanayaka`: 9 positions × birth year, following year, analysis year. Partial verified event mapping. `null` for Raja/Dhanyadhipati/Dhanadhipati pending confirmed assignment rules. Civil Gregorian year columns are **provisional**; the example's Tamil solar year convention needs validation.
- `clientAmirthuBhaga`: complete transcribed 10×12 reference matrix and 10 personalized D1 natal rows. `classification: "UNVERIFIED"` is intentional: screenshot does not specify how close a planet must be to the Amirthu degree, nor define the contrary Asubam threshold. Do not translate `UNVERIFIED` into Subam or Asubam.

### Source and calculation notes

Navanayaka published tradition: https://www.drikpanchang.com/festivals/samvat-newyear/info/about-new-samvata-mantri-mandala.html

Calculated positions using the repository's existing astronomy-engine `SunPosition` plus its existing approximate Lahiri ayanamsa formula (duplicated, not modified). Event dates are approximate and need reference comparison before release. Dates are expressed in UTC; weekday selection is computed in Asia/Kolkata (+05:30). For exact local sunrise/tithi calendar rules, a Panchangam calculation needs to be implemented and validated independently.

Amirthu chart: client-provided image, Oct 30 2026, transcribed into `data/clientAmirthuBhagaMatrix.json`. A 120-cell integrity test and sample values are in `tests/clientNewReferenceReports.test.js`. The chart's text mentions Dasha ruler; current report shows all 10 D1 bodies; a future verified Dasha-specific designation can be selected using existing Dasha output.

### Use

`POST /api/horoscope/generate` with normal request body. Example (replace with real birth details):

```json
{"birthDate":"04/04/1971","birthTime":"07:52 AM","place":"Chennai","latitude":13.0827,"longitude":80.2707,"language":"ta"}
```

No new external or paid APIs are used. Coordinates are optional in normal operation but supplying them avoids external geocoding for local smoke tests.

### Tests

```powershell
node --test tests/clientNewReferenceReports.test.js
# Start server separately before executing fullApiRegression.test.js:
npm start
# In second terminal:
node --test tests/*.test.js
```

Local tests: 3/3 new module tests passed. With server running, aggregate 53/54 suites passed; `fullApiRegression.test.js` was blocked by unavailable OpenStreetMap geocoding (EAI_AGAIN), not by failed new business calculations. A direct local POST with Chennai coordinates returned success and both new response blocks.

### Still required before releasing these reports in Flutter

1. Verify complete Navanayaka year assignment rules for Raja, Dhanyadhipati, Dhanadhipati against trusted Panchangam; decide Tamil solar year vs lunar Samvatsara convention; verify solar event dates.
2. Find authoritative Amirthu degree tolerance/auspiciousness rule to populate Subam/Asubam. Do not classify all other degrees as Asubam without a rule.
3. Validate the full transcribed matrix and rules with client/recognized practitioner, then add reference fixtures.
4. Only after approval, bind these two new outputs into Flutter Result Page's separate scrollable table sections. PDF output must not change.
