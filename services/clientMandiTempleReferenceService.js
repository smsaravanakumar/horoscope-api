'use strict';

// This is a house-wise REFERENCE LOOKUP, not a Mandi Dosha judgement.
// Exempt houses (3/6/11) still have a reference temple. Never recalculate
// Mandi positions or conflate reference tables with personalized advice.
const source = require('../data/clientMandiHouseTemples.json');

function selectMandiTempleByHouse(house, language = 'ta') {
  if (!Number.isInteger(house) || house < 1 || house > 12) return null;
  const record = source.entries.find((entry) => entry.houseNumber === house);
  if (!record) return null;
  const selected = language === 'en' && record.en ? record.en : record.ta;
  return {
    houseNumber: house,
    ...selected,
    originalLanguage: language === 'en' && !record.en ? 'ta' : language,
    source: source.source,
    reviewStatus: source.reviewStatus,
  };
}

module.exports = { selectMandiTempleByHouse };
