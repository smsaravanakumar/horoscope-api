function getPlanetRemedy(planetKey, language = "ta") {
  const remedies = {
    ta: {
      sun: "ஞாயிற்றுக்கிழமை சூரிய நமஸ்காரம் செய்து ஆதித்ய ஹ்ருதயம் பாராயணம் செய்யலாம்.",
      moon: "திங்கட்கிழமை அம்மன் வழிபாடு செய்து பால் அபிஷேகம் செய்யலாம்.",
      mars: "செவ்வாய்க்கிழமை முருகன் வழிபாடு செய்து கந்த சஷ்டி கவசம் பாராயணம் செய்யலாம்.",
      mercury: "புதன்கிழமை விஷ்ணு வழிபாடு செய்து பச்சை நிற பொருள் தானம் செய்யலாம்.",
      jupiter: "வியாழக்கிழமை குரு பகவான் வழிபாடு செய்து மஞ்சள் பொருள் தானம் செய்யலாம்.",
      venus: "வெள்ளிக்கிழமை மகாலட்சுமி வழிபாடு செய்து வெள்ளை நிற பொருள் தானம் செய்யலாம்.",
      saturn: "சனிக்கிழமை சனி பகவான் வழிபாடு செய்து எள் எண்ணெய் தீபம் ஏற்றலாம்.",
      rahu: "ராகு காலத்தில் துர்கை அம்மன் வழிபாடு செய்து எலுமிச்சை தீபம் ஏற்றலாம்.",
      ketu: "விநாயகர் வழிபாடு செய்து கேது பீஜ மந்திரம் ஜபிக்கலாம்.",
    },
    en: {
      sun: "On Sundays, perform Surya Namaskar and recite Aditya Hridayam.",
      moon: "On Mondays, worship Goddess Amman and offer milk abhishekam.",
      mars: "On Tuesdays, worship Lord Murugan and recite Kanda Sashti Kavacham.",
      mercury: "On Wednesdays, worship Lord Vishnu and donate green-colored items.",
      jupiter: "On Thursdays, worship Guru Bhagavan and donate yellow-colored items.",
      venus: "On Fridays, worship Mahalakshmi and donate white-colored items.",
      saturn: "On Saturdays, worship Shani Bhagavan and light a sesame oil lamp.",
      rahu: "During Rahu Kalam, worship Goddess Durga and light a lemon lamp.",
      ketu: "Worship Lord Ganesha and chant Ketu Beeja Mantra.",
    },
  };

  return remedies[language][planetKey] || "";
}

function planetKeyFromTamilName(name) {
  const map = {
    "சூரியன்": "sun",
    "சந்திரன்": "moon",
    "செவ்வாய்": "mars",
    "புதன்": "mercury",
    "குரு": "jupiter",
    "சுக்கிரன்": "venus",
    "சனி": "saturn",
    "ராகு": "rahu",
    "கேது": "ketu",
  };

  return map[name] || null;
}

function planetKeyFromEnglishName(name) {
  const map = {
    Sun: "sun",
    Moon: "moon",
    Mars: "mars",
    Mercury: "mercury",
    Jupiter: "jupiter",
    Venus: "venus",
    Saturn: "saturn",
    Rahu: "rahu",
    Ketu: "ketu",
  };

  return map[name] || null;
}

function getDoshaRemedy(doshaKey, language = "ta") {
  const remedies = {
    ta: {
      sevvai_dosham:
        "செவ்வாய்க்கிழமை முருகன் வழிபாடு செய்து கந்த சஷ்டி கவசம் பாராயணம் செய்யலாம்.",
      shani_dosha:
        "சனிக்கிழமை சனி பகவான் வழிபாடு செய்து எள் எண்ணெய் தீபம் ஏற்றலாம்.",
      rahu_ketu_dosha:
        "ராகு கேது தோஷ நிவர்த்திக்காக விநாயகர் மற்றும் துர்கை அம்மன் வழிபாடு செய்யலாம்.",
      kala_sarpa_dosha:
        "நாக தோஷ நிவர்த்தி பூஜை செய்து விநாயகர் வழிபாடு செய்யலாம்.",
      kemadruma_dosha:
        "திங்கட்கிழமை சந்திர பகவான் மற்றும் அம்மன் வழிபாடு செய்யலாம்.",
    },
    en: {
      sevvai_dosham:
        "On Tuesdays, worship Lord Murugan and recite Kanda Sashti Kavacham.",
      shani_dosha:
        "On Saturdays, worship Shani Bhagavan and light a sesame oil lamp.",
      rahu_ketu_dosha:
        "For Rahu-Ketu dosha, worship Lord Ganesha and Goddess Durga.",
      kala_sarpa_dosha:
        "Perform Naga Dosha remedy prayers and worship Lord Ganesha.",
      kemadruma_dosha:
        "On Mondays, worship Moon deity and Goddess Amman.",
    },
  };

  return remedies[language][doshaKey] || "";
}

function buildRemedies({ planets, doshas, dasha, language = "ta" }) {
  const remedies = [];

  doshas.forEach((dosha) => {
    const remedy = getDoshaRemedy(dosha.key, language);

    if (remedy) {
      remedies.push({
        category: "dosha",
        for: dosha.name,
        key: dosha.key,
        remedy,
      });
    }
  });

  planets.forEach((planet) => {
    const isWeak =
      planet.strength === (language === "ta" ? "நீசம்" : "Debilitated");

    if (isWeak) {
      remedies.push({
        category: "planet",
        for:
          language === "ta"
            ? `${planet.name} பலவீனம்`
            : `${planet.name} Weakness`,
        planet: planet.name,
        key: planet.key,
        remedy: getPlanetRemedy(planet.key, language),
      });
    }
  });

  if (dasha && dasha.currentDasha) {
    const planetKey =
      language === "ta"
        ? planetKeyFromTamilName(dasha.currentDasha)
        : planetKeyFromEnglishName(dasha.currentDasha);

    if (planetKey) {
      remedies.push({
        category: "dasha",
        for:
          language === "ta"
            ? `${dasha.currentDasha} திசை`
            : `${dasha.currentDasha} Dasha`,
        planet: dasha.currentDasha,
        key: planetKey,
        remedy: getPlanetRemedy(planetKey, language),
      });
    }
  }

  if (dasha && dasha.currentBhukti) {
    const planetKey =
      language === "ta"
        ? planetKeyFromTamilName(dasha.currentBhukti)
        : planetKeyFromEnglishName(dasha.currentBhukti);

    if (planetKey) {
      remedies.push({
        category: "bhukti",
        for:
          language === "ta"
            ? `${dasha.currentBhukti} புத்தி`
            : `${dasha.currentBhukti} Bhukti`,
        planet: dasha.currentBhukti,
        key: planetKey,
        remedy: getPlanetRemedy(planetKey, language),
      });
    }
  }

  return remedies;
}

module.exports = {
  buildRemedies,
};