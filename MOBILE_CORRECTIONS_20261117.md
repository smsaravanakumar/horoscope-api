# Mobile API corrections — 2026-11-17

Apply the modified-only ZIP over the supplied 20261117-050419 API baseline. No Flutter changes, deployment or change to frozen dosha formulas. Run `npm ci`, start `node server.js` in one terminal, then `node --test tests/*.test.js` and `npm audit` in another.

## Additive API fields

- `planetaryStates.natal` and `.gocharam`: `referenceIsoUtc`, `combustPlanets`, `signExchanges`, `nakshatraExchanges`, `retrogradePeriods`. Sign exchanges use seven classical planets; Nakshatra exchanges include the nodes, not Mandi/Lagna. Keys are invariant across languages; names follow request language. Retrograde periods use the existing geocentric speed approximation, bracket the retrograde instant, and report IST dates plus UTC ISO timestamps. Direct planets have null period dates; mean nodes are deliberately excluded from station searches. These station dates are model results, not yet independently matched to the client's Panchangam.
- `birthCalculationDetails.dashaTimeline.currentAntaram`: nested Vimshottari period using the existing 365.25-day timeline convention and Bhukti lord as the first subperiod. Existing Dasha and Bhukti fields are unchanged.
- `clientDashaPeriods.natal`: same timeline; `gocharam.evaluated=false` because the screenshot does not specify the transit Dasha convention. No fabricated date.
- `clientAstroRules.clientKalaSarpa.remedyByPlanet`: bilingual Ketu/Rahu temple records, only on positive detection. Legacy `remedy.temples` preserved.
- `clientTempleReferences.mudakkuNodeReference`: 12 Rahu and 12 Ketu source-transcription rows, reference-only, pending proofreading and personalized node selection rule. Existing sign-house lookup unchanged except for corrected order.

## Temple reference changes and remaining acceptance checks

- The common first-house temple is restored for Cancer, Leo, Sagittarius/Pisces and Capricorn/Aquarius; old house 1–11 entries move to houses 2–12. Duplicate old last entries are displaced. Aries/Scorpio, Taurus/Libra and Gemini/Virgo already had the first-house temple. Prior temple descriptions are retained for matching identities; exact wording and location discrepancies throughout the new image still require proofreading. The new node reference is a draft transcription, not an approved personalized remedy. Please supply the editable reference/original PDF for exact text comparison.
- Maandhi houses 4, 9, 10, 11 updated from client reference; all twelve remain present, including dosha-exempt houses. Unclear exact text in the low-resolution screenshot (particularly houses 2 and 12) remains subject to confirmation. No dosha exemption changed. Existing proper nouns are retained in Tamil in English output pending approved transliteration.
- Yogi label spelling is Flutter-only; defer to Flutter integration.
- Need client birth inputs and expected natal/Gocharam periods to validate Antaram and establish Gocharam convention. Do not deploy as a fully validated release until these are resolved.

## Test coverage

`tests/clientMobileCorrections.test.js`: common first house, shifted sequence samples, node reference cardinality, combustion/exchanges, synthetic station boundaries, real ephemeris consistency, Antaram containment and language parity.
