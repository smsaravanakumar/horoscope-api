# Navanayaka and Amirthu reference reports — verified progress

This patch builds on horoscope_api(20261030-173833).zip.

## Navanayaka
Added provisional solar-ingress mappings:
- Dhanyadhipati: Dhanu (Sagittarius) Sankranti, published in https://panchangtime.com/about/mantri-mandala
- Dhanadhipati: Kanya (Virgo) Sankranti, published in https://panchangtime.com/about/mantri-mandala

Other previously implemented ingress roles are retained. Output labels these results PROVISIONAL because the existing solver uses an approximate Lahiri formula, IST civil weekday (not sunrise-reckoned weekday), and Gregorian year labels (not fully validated Tamil solar-year boundaries). The Raja needs Chaitra Shukla Pratipada determination at local sunrise. The client screenshot does not establish the exact year convention. Do not interpret null Raja as an actual planetary result.

## Amirthu
The client-supplied 10 x 12 reference matrix and D1-based personalized degree lookup remain intact. Published generic benefic/malefic classifications are NOT a valid substitute for a documented degree-specific Subam/Asubam rule. Thus classification remains UNVERIFIED; do not display it as Subam/Asubam yet.

## Testing
- node --test tests/clientNewReferenceReports.test.js: 5 passed, 0 failed.
- Full test runner: 55 passed, 1 failed in this container; the failed fullApiRegression.test.js calls external Nominatim geocoding which is blocked by unavailable DNS/network. The same fixtures should be rerun on a network-enabled machine. No existing horoscope / PDF / Flutter code was modified.

## Release status
NOT FROZEN / NOT READY for asserting definitive Navanayaka or Amirthu interpretations. Do not deploy without reference validation, local sunrise/weekday, year alignment, and the client-specific Amirthu classification rule.
