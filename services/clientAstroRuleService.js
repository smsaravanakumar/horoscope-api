/**
 * Client-specific astrology rules.
 *
 * IMPORTANT:
 * - This service is ADDITIVE ONLY.
 * - It must not change any existing horoscope, dasha, dosha, yoga,
 *   planet-position, chart, or remedy calculation.
 * - It consumes already-calculated planet/dasha values and returns
 *   a separate client-rule result object.
 */

const RASI_NAMES = {
  1: { ta: "மேஷம்", en: "Aries" },
  2: { ta: "ரிஷபம்", en: "Taurus" },
  3: { ta: "மிதுனம்", en: "Gemini" },
  4: { ta: "கடகம்", en: "Cancer" },
  5: { ta: "சிம்மம்", en: "Leo" },
  6: { ta: "கன்னி", en: "Virgo" },
  7: { ta: "துலாம்", en: "Libra" },
  8: { ta: "விருச்சிகம்", en: "Scorpio" },
  9: { ta: "தனுசு", en: "Sagittarius" },
  10: { ta: "மகரம்", en: "Capricorn" },
  11: { ta: "கும்பம்", en: "Aquarius" },
  12: { ta: "மீனம்", en: "Pisces" },
};

// One common 12-Rasi table is reused for Dasha Lord, Bhukti Lord,
// Jeevanadi Deity and Profession Deity.
const RASI_DEITY_TEMPLE = {
  1: {
    direct: {
      deity: { ta: "குற்றாலநாதர்", en: "Kutralanathar" },
      place: { ta: "குற்றாலம்", en: "Courtallam" },
    },
    retrograde: {
      deity: { ta: "நெல்லையப்பர்", en: "Nellaiappar" },
      place: { ta: "திருநெல்வேலி", en: "Tirunelveli" },
    },
  },
  2: {
    direct: {
      deity: { ta: "மீனாட்சி அம்மன்", en: "Meenakshi Amman" },
      place: { ta: "மதுரை", en: "Madurai" },
    },
    retrograde: {
      deity: { ta: "நிமிலிபாலா திரிபுரசுந்தரி", en: "Nimilipaala Tripurasundari" },
      place: { ta: "அரக்கோணம்", en: "Arakkonam" },
    },
  },
  3: {
    direct: {
      deity: { ta: "மகாலட்சுமி தாயார்", en: "Mahalakshmi Thayar" },
      place: { ta: "திருஆவினங்குடி, பழனி", en: "Thiru Avinankudi, Palani" },
    },
    retrograde: {
      deity: { ta: "லலிதாம்பிகை தாயார்", en: "Lalithambigai Thayar" },
      place: { ta: "திருமீயச்சூர், திருவாரூர் மாவட்டம்", en: "Thirumeeyachur, Tiruvarur District" },
    },
  },
  4: {
    direct: {
      deity: { ta: "பர்வதவர்த்தினி தாயார்", en: "Parvathavarthini Thayar" },
      place: { ta: "இராமேஸ்வரம்", en: "Rameswaram" },
    },
    retrograde: {
      deity: { ta: "விஷ்ணு துர்க்கை அம்மன்", en: "Vishnu Durga Amman" },
      place: { ta: "பட்டீஸ்வரம்", en: "Patteeswaram" },
    },
  },
  5: {
    direct: {
      deity: { ta: "நெல்லையப்பர்", en: "Nellaiappar" },
      place: { ta: "திருநெல்வேலி", en: "Tirunelveli" },
    },
    retrograde: {
      deity: { ta: "சிங்கபெருமாள்", en: "Singa Perumal" },
      place: { ta: "திருச்சி", en: "Tiruchirappalli" },
    },
  },
  6: {
    direct: {
      deity: { ta: "நிமிலிபாலா திரிபுரசுந்தரி", en: "Nimilipaala Tripurasundari" },
      place: { ta: "அரக்கோணம்", en: "Arakkonam" },
    },
    retrograde: {
      deity: { ta: "அலமேலு மங்கை தாயார்", en: "Alamelu Mangai Thayar" },
      place: { ta: "கீழ் திருப்பதி", en: "Keezh Tirupati" },
    },
  },
  7: {
    direct: {
      deity: { ta: "லலிதாம்பிகை தாயார்", en: "Lalithambigai Thayar" },
      place: { ta: "திருமீயச்சூர், திருவாரூர் மாவட்டம்", en: "Thirumeeyachur, Tiruvarur District" },
    },
    retrograde: {
      deity: { ta: "வாராஹி அம்மன்", en: "Varahi Amman" },
      place: { ta: "உத்திரகோசமங்கை, இராமேஸ்வரம் அருகே", en: "Uthirakosamangai, near Rameswaram" },
    },
  },
  8: {
    direct: {
      deity: { ta: "விஷ்ணு துர்க்கை அம்மன்", en: "Vishnu Durga Amman" },
      place: { ta: "பட்டீஸ்வரம்", en: "Patteeswaram" },
    },
    retrograde: {
      deity: { ta: "தெத்துப்பட்டி ராஜகாளியம்மன்", en: "Thethupatti Rajakaliamman" },
      place: { ta: "திண்டுக்கல் மாவட்டம்", en: "Dindigul District" },
    },
  },
  9: {
    direct: {
      deity: { ta: "சிங்கபெருமாள்", en: "Singa Perumal" },
      place: { ta: "திருச்சி", en: "Tiruchirappalli" },
    },
    retrograde: {
      deity: { ta: "குற்றாலநாதர்", en: "Kutralanathar" },
      place: { ta: "குற்றாலம்", en: "Courtallam" },
    },
  },
  10: {
    direct: {
      deity: { ta: "அலமேலு மங்கை தாயார்", en: "Alamelu Mangai Thayar" },
      place: { ta: "கீழ் திருப்பதி", en: "Keezh Tirupati" },
    },
    retrograde: {
      deity: { ta: "மீனாட்சி அம்மன்", en: "Meenakshi Amman" },
      place: { ta: "மதுரை", en: "Madurai" },
    },
  },
  11: {
    direct: {
      deity: { ta: "வாராஹி அம்மன்", en: "Varahi Amman" },
      place: { ta: "உத்திரகோசமங்கை, இராமேஸ்வரம் அருகே", en: "Uthirakosamangai, near Rameswaram" },
    },
    retrograde: {
      deity: { ta: "மகாலட்சுமி தாயார்", en: "Mahalakshmi Thayar" },
      place: { ta: "திருஆவினங்குடி, பழனி", en: "Thiru Avinankudi, Palani" },
    },
  },
  12: {
    direct: {
      deity: { ta: "தெத்துப்பட்டி ராஜகாளியம்மன்", en: "Thethupatti Rajakaliamman" },
      place: { ta: "திண்டுக்கல் மாவட்டம்", en: "Dindigul District" },
    },
    retrograde: {
      deity: { ta: "பர்வதவர்த்தினி தாயார்", en: "Parvathavarthini Thayar" },
      place: { ta: "இராமேஸ்வரம்", en: "Rameswaram" },
    },
  },
};

const RASI_WEEKDAYS = {
  1: { ta: "செவ்வாய்க்கிழமை", en: "Tuesday" },
  2: { ta: "வெள்ளிக்கிழமை", en: "Friday" },
  3: { ta: "புதன்கிழமை", en: "Wednesday" },
  4: { ta: "திங்கட்கிழமை", en: "Monday" },
  5: { ta: "ஞாயிற்றுக்கிழமை", en: "Sunday" },
  6: { ta: "புதன்கிழமை", en: "Wednesday" },
  7: { ta: "வெள்ளிக்கிழமை", en: "Friday" },
  8: { ta: "செவ்வாய்க்கிழமை", en: "Tuesday" },
  9: { ta: "வியாழக்கிழமை", en: "Thursday" },
  10: { ta: "சனிக்கிழமை", en: "Saturday" },
  11: { ta: "சனிக்கிழமை", en: "Saturday" },
  12: { ta: "வியாழக்கிழமை", en: "Thursday" },
};

const AFFECTED_RASI_TEMPLES = {
  1: { ta: "பழனி முருகன் கோவில்", en: "Palani Murugan Temple" },
  2: { ta: "அபிராமி அமிர்தகடேஸ்வரர், திருக்கடையூர், மயிலாடுதுறை", en: "Abirami Amirthakadeswarar Temple, Thirukadaiyur, Mayiladuthurai" },
  3: { ta: "சங்கரநாராயணர், சங்கரன்கோவில்", en: "Sankaranarayanar Temple, Sankarankovil" },
  4: { ta: "சங்கமேஸ்வரர், பவானி கூடுதுறை", en: "Sangameswarar Temple, Bhavani Kooduthurai" },
  5: { ta: "பாவநாசநாதர், பாபநாசம், தென்காசி", en: "Pavanasanaathar Temple, Papanasam, Tenkasi" },
  6: { ta: "குருவாயூரப்பன், குருவாயூர்", en: "Guruvayurappan Temple, Guruvayur" },
  7: { ta: "பிரசன்ன வெங்கடேச பெருமாள், குணசீலம், திருச்சி", en: "Prasanna Venkatesa Perumal Temple, Gunaseelam, Tiruchirappalli" },
  8: { ta: "பிராணநாதேஸ்வரர் கோவில்", en: "Prananatheswarar Temple" },
  9: { ta: "சரபேஸ்வரர், திருப்புவனம், தஞ்சாவூர்", en: "Sarabeswarar Temple, Thirubuvanam, Thanjavur" },
  10: { ta: "அவினாசியப்பர், அவினாசி, திருப்பூர்", en: "Avinasiappar Temple, Avinashi, Tiruppur" },
  11: { ta: "கற்பகாம்பாள், மைலாப்பூர், சென்னை", en: "Karpagambal Temple, Mylapore, Chennai" },
  12: { ta: "முருகன் கோவில், திருச்செந்தூர்", en: "Murugan Temple, Tiruchendur" },
};

const PLANET_GRAINS = {
  sun: { ta: "கோதுமை", en: "Wheat" },
  moon: { ta: "நெல் அல்லது அரிசி", en: "Paddy or rice" },
  mars: { ta: "துவரம்பருப்பு", en: "Toor dal" },
  mercury: { ta: "பாசிப்பயறு", en: "Green gram" },
  jupiter: { ta: "கொண்டைக்கடலை", en: "Chickpeas" },
  venus: { ta: "மொச்சை", en: "Field beans" },
  saturn: { ta: "எள் அல்லது எள்ளெண்ணெய்", en: "Sesame or sesame oil" },
  mandi: { ta: "எள்", en: "Sesame" },
  // Client supplied these grain mappings for reference, but Rahu and Ketu
  // are explicitly excluded as affected planets in the trapped-planet rule.
  rahu: { ta: "உளுந்து", en: "Black gram" },
  ketu: { ta: "கொள்ளு", en: "Horse gram" },
};

const DASHA_TO_PLANET_KEY = {
  // Tamil
  "சூரியன்": "sun",
  "சந்திரன்": "moon",
  "செவ்வாய்": "mars",
  "புதன்": "mercury",
  "குரு": "jupiter",
  "சுக்கிரன்": "venus",
  "சனி": "saturn",
  "சனிபகவான்": "saturn",
  "ராகு": "rahu",
  "கேது": "ketu",
  // English
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

const CLIENT_KALA_SARPA_PLANETS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

const TRAPPED_PLANET_KEYS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
  "mandi",
];

function getPlanet(planets, key) {
  return Array.isArray(planets) ? planets.find((planet) => planet.key === key) : null;
}

function localized(value, language) {
  if (!value) return null;
  return value[language] || value.en || value.ta || null;
}

function buildTempleResult(planet, language) {
  if (!planet || !RASI_DEITY_TEMPLE[planet.rasiNo]) return null;

  const mode = planet.retrograde ? "retrograde" : "direct";
  const selected = RASI_DEITY_TEMPLE[planet.rasiNo][mode];

  return {
    planetKey: planet.key,
    planetName: planet.name,
    rasiNo: planet.rasiNo,
    rasi: localized(RASI_NAMES[planet.rasiNo], language),
    retrograde: Boolean(planet.retrograde),
    deity: localized(selected.deity, language),
    place: localized(selected.place, language),
  };
}

function buildDashaBhuktiTemple({ planets, dasha, language }) {
  const dashaKey = DASHA_TO_PLANET_KEY[dasha?.currentDasha] || null;
  const bhuktiKey = DASHA_TO_PLANET_KEY[dasha?.currentBhukti] || null;

  return {
    dashaLord: dashaKey
      ? {
          lord: dasha.currentDasha,
          ...buildTempleResult(getPlanet(planets, dashaKey), language),
        }
      : null,
    bhuktiLord: bhuktiKey
      ? {
          lord: dasha.currentBhukti,
          ...buildTempleResult(getPlanet(planets, bhuktiKey), language),
        }
      : null,
  };
}

function normalizeGender(gender) {
  const value = String(gender || "").trim().toLowerCase();
  if (["male", "m", "ஆண்", "ஆண் பாலினம்"].includes(value)) return "male";
  if (["female", "f", "பெண்", "பெண் பாலினம்"].includes(value)) return "female";
  return null;
}

function buildJeevanadiDeity({ gender, planets, language }) {
  const normalizedGender = normalizeGender(gender);
  if (!normalizedGender) return null;

  const planetKey = normalizedGender === "male" ? "jupiter" : "venus";
  const planet = getPlanet(planets, planetKey);
  const temple = buildTempleResult(planet, language);

  if (!temple) return null;

  return {
    gender: normalizedGender,
    rulePlanetKey: planetKey,
    ...temple,
  };
}

function buildProfessionDeity({ planets, language }) {
  const saturn = getPlanet(planets, "saturn");
  const temple = buildTempleResult(saturn, language);
  if (!temple) return null;

  return {
    rulePlanetKey: "saturn",
    ...temple,
  };
}

/**
 * Client-supplied special deity outputs.
 *
 * IMPORTANT: these rules intentionally follow the client's requested
 * planet mapping exactly. Do not replace them with general astrology
 * interpretations unless the client asks for a future change.
 */
function buildPlanetPurposeDeity({ planets, planetKey, language }) {
  const planet = getPlanet(planets, planetKey);
  const temple = buildTempleResult(planet, language);
  if (!temple) return null;

  return {
    rulePlanetKey: planetKey,
    ...temple,
  };
}

function normalizeMaritalStatus(maritalStatus) {
  const value = String(maritalStatus || "").trim().toLowerCase();

  if (
    [
      "unmarried",
      "single",
      "not married",
      "திருமணம் ஆகவில்லை",
      "திருமணமாகவில்லை",
      "திருமணம் ஆகாதவர்",
      "திருமணமாகாதவர்",
    ].includes(value)
  ) {
    return "unmarried";
  }

  if (
    [
      "married",
      "திருமணம் ஆனவர்",
      "திருமணமானவர்",
      "திருமணம் ஆகிவிட்டது",
    ].includes(value)
  ) {
    return "married";
  }

  return null;
}

function buildGovernmentPoliticsDeity({ planets, language }) {
  return buildPlanetPurposeDeity({
    planets,
    planetKey: "sun",
    language,
  });
}

function buildEducationDeity({ planets, language }) {
  return buildPlanetPurposeDeity({
    planets,
    planetKey: "mercury",
    language,
  });
}

function buildMarriageDeity({ gender, maritalStatus, planets, language }) {
  const normalizedGender = normalizeGender(gender);
  const normalizedMaritalStatus = normalizeMaritalStatus(maritalStatus);

  // Client rule: marriage deity must be returned only for an unmarried person.
  if (!normalizedGender || normalizedMaritalStatus !== "unmarried") {
    return null;
  }

  // Client-specific mapping:
  //   unmarried male   -> Venus Rasi deity
  //   unmarried female -> Mars Rasi deity
  const planetKey = normalizedGender === "male" ? "venus" : "mars";
  const temple = buildTempleResult(getPlanet(planets, planetKey), language);
  if (!temple) return null;

  return {
    gender: normalizedGender,
    maritalStatus: normalizedMaritalStatus,
    rulePlanetKey: planetKey,
    ...temple,
  };
}

function buildKetuRemedy({ planets, language }) {
  const ketu = getPlanet(planets, "ketu");
  if (!ketu || !RASI_WEEKDAYS[ketu.rasiNo]) return null;

  return {
    rasiNo: ketu.rasiNo,
    rasi: localized(RASI_NAMES[ketu.rasiNo], language),
    weekday: localized(RASI_WEEKDAYS[ketu.rasiNo], language),
    instruction:
      language === "ta"
        ? `${localized(RASI_WEEKDAYS[ketu.rasiNo], language)} பிள்ளையாருக்கு அருகம்புல் வைத்து வழிபாடு செய்து வர வேண்டும்.`
        : `On ${localized(RASI_WEEKDAYS[ketu.rasiNo], language)}, worship Lord Vinayagar by offering arugampul.` ,
  };
}

function buildRahuDashaRemedy({ dasha, language }) {
  const dashaKey = DASHA_TO_PLANET_KEY[dasha?.currentDasha] || null;
  const active = dashaKey === "rahu";

  return {
    active,
    instruction: active
      ? language === "ta"
        ? "ராகு திசை நடந்தால் தேய்பிறை அஷ்டமி தோறும் அருகில் உள்ள காலபைரவருக்கு நெய்தீபம் ஏற்ற வேண்டும்."
        : "During Rahu Dasha, light a ghee lamp for a nearby Kala Bhairavar on every waning-moon Ashtami."
      : null,
  };
}

function normalize360(value) {
  let result = Number(value) % 360;
  if (result < 0) result += 360;
  return result;
}

function isWithinInclusiveForwardArc(degree, start, end) {
  const d = normalize360(degree);
  const s = normalize360(start);
  const e = normalize360(end);

  // Client-confirmed Kala Sarpa boundary rule:
  // a planet exactly conjunct Rahu or Ketu is treated as inside the enclosure.
  if (s < e) return d >= s && d <= e;
  return d >= s || d <= e;
}

function isJoinedWithNode(planet, rahu, ketu) {
  // Client-confirmed "joint" rule:
  // if a planet shares the same Rasi/house with Rahu or Ketu,
  // treat that planet as lying on the Rahu-Ketu boundary even when its
  // exact longitude falls just outside the numerical arc limit.
  return (
    Number(planet?.rasiNo) === Number(rahu?.rasiNo) ||
    Number(planet?.rasiNo) === Number(ketu?.rasiNo)
  );
}

/**
 * Client-specific Kala Sarpa rule:
 * Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn must all fall
 * between Rahu and Ketu on the same arc. Mandi is intentionally ignored.
 * Rahu/Ketu boundary conjunctions are included as inside the arc.
 * A planet sharing the same Rasi/house with Rahu or Ketu is also treated
 * as joined to that node and therefore inside the enclosure.
 */
function detectClientKalaSarpa({ planets, language }) {
  const rahu = getPlanet(planets, "rahu");
  const ketu = getPlanet(planets, "ketu");
  if (!rahu || !ketu) return { result: false };

  const requiredPlanets = CLIENT_KALA_SARPA_PLANETS.map((key) =>
    getPlanet(planets, key)
  );

  if (requiredPlanets.some((planet) => !planet)) {
    return {
      result: false,
      reason:
        language === "ta"
          ? "தேவையான 7 கிரகங்களில் ஒன்று அல்லது அதற்கு மேற்பட்டவை கிடைக்கவில்லை."
          : "One or more of the required seven planets is missing.",
    };
  }

  const rahuToKetu = requiredPlanets.every((planet) =>
    isJoinedWithNode(planet, rahu, ketu) ||
    isWithinInclusiveForwardArc(planet.longitude, rahu.longitude, ketu.longitude)
  );

  const ketuToRahu = requiredPlanets.every((planet) =>
    isJoinedWithNode(planet, rahu, ketu) ||
    isWithinInclusiveForwardArc(planet.longitude, ketu.longitude, rahu.longitude)
  );

  const result = rahuToKetu || ketuToRahu;

  return {
    result,
    consideredPlanets: [...CLIENT_KALA_SARPA_PLANETS],
    mandiExcluded: true,
    remedy: result
      ? {
          temples: [
            language === "ta"
              ? "முத்தாரம்மன், குலசேகரப்பட்டணம், திருச்செந்தூர் அருகே"
              : "Mutharamman Temple, Kulasekarapattinam, near Tiruchendur",
            language === "ta"
              ? "காலபைரவர், வைரவன்பட்டி, பிள்ளையார்பட்டி அருகே"
              : "Kala Bhairavar, Vairavanpatti, near Pillayarpatti",
          ],
        }
      : null,
  };
}

function fourthRasiFrom(rasiNo) {
  // Starting sign is counted as 1; therefore the 4th sign is +3.
  return ((Number(rasiNo) + 2) % 12) + 1;
}

/**
 * Client "Rahu/Ketu grip" rule.
 *
 * The rule is evaluated against both fourth-sign targets:
 * - 4th sign from Rahu
 * - 4th sign from Ketu
 *
 * Rahu and Ketu themselves are excluded as affected planets.
 * Mandi is allowed, per the client's clarification.
 * The candidate must be the only occupant in that Rasi.
 */
function detectRahuKetuAffectedPlanets({ planets, language }) {
  const rahu = getPlanet(planets, "rahu");
  const ketu = getPlanet(planets, "ketu");
  if (!rahu || !ketu) return [];

  const targetRasis = new Set([
    fourthRasiFrom(rahu.rasiNo),
    fourthRasiFrom(ketu.rasiNo),
  ]);

  return TRAPPED_PLANET_KEYS.map((key) => getPlanet(planets, key))
    .filter(Boolean)
    .filter((planet) => targetRasis.has(planet.rasiNo))
    .filter((planet) => {
      const occupants = planets.filter((item) => item.rasiNo === planet.rasiNo);
      return occupants.length === 1;
    })
    .map((planet) => ({
      planetKey: planet.key,
      planetName: planet.name,
      rasiNo: planet.rasiNo,
      rasi: localized(RASI_NAMES[planet.rasiNo], language),
      grain: localized(PLANET_GRAINS[planet.key], language),
      temple: localized(AFFECTED_RASI_TEMPLES[planet.rasiNo], language),
      instruction:
        language === "ta"
          ? `${localized(AFFECTED_RASI_TEMPLES[planet.rasiNo], language)} கோவிலுக்கு ${localized(PLANET_GRAINS[planet.key], language)} தானியத்தை துலாபாரம் செலுத்த வேண்டும்.`
          : `Offer ${localized(PLANET_GRAINS[planet.key], language)} as Tulabharam at ${localized(AFFECTED_RASI_TEMPLES[planet.rasiNo], language)}.`,
    }));
}

function buildClientAstroRules({
  gender,
  maritalStatus,
  planets,
  dasha,
  language = "ta",
}) {
  return {
    dashaBhuktiTemple: buildDashaBhuktiTemple({ planets, dasha, language }),
    jeevanadiDeity: buildJeevanadiDeity({ gender, planets, language }),
    professionDeity: buildProfessionDeity({ planets, language }),
    governmentPoliticsDeity: buildGovernmentPoliticsDeity({
      planets,
      language,
    }),
    educationDeity: buildEducationDeity({ planets, language }),
    marriageDeity: buildMarriageDeity({
      gender,
      maritalStatus,
      planets,
      language,
    }),
    jeevanadiMantra: {
      ta: "ஒம் ஹம் அம் தம் காகபுசுண்டரே வசி வசி சிவயநம",
      en: "Om Ham Am Tham Kagabusundare Vasi Vasi Sivayanama",
    },
    silverRing: {
      ta: "வெள்ளி மோதிரம் 17 கிராம் வலது கை நடு விரலில் போட வேண்டும்.",
      en: "Wear a 17-gram silver ring on the middle finger of the right hand.",
    },
    ketuRemedy: buildKetuRemedy({ planets, language }),
    rahuDashaRemedy: buildRahuDashaRemedy({ dasha, language }),
    clientKalaSarpa: detectClientKalaSarpa({ planets, language }),
    rahuKetuAffectedPlanets: detectRahuKetuAffectedPlanets({
      planets,
      language,
    }),
  };
}

module.exports = {
  buildClientAstroRules,
  // Exported for focused unit testing only.
  normalizeMaritalStatus,
  buildGovernmentPoliticsDeity,
  buildEducationDeity,
  buildMarriageDeity,
  detectClientKalaSarpa,
  detectRahuKetuAffectedPlanets,
  fourthRasiFrom,
};
