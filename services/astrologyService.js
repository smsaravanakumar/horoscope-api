const RASI = {
  ta: [
    "மேஷம்",
    "ரிஷபம்",
    "மிதுனம்",
    "கடகம்",
    "சிம்மம்",
    "கன்னி",
    "துலாம்",
    "விருச்சிகம்",
    "தனுசு",
    "மகரம்",
    "கும்பம்",
    "மீனம்",
  ],
  en: [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ],
};

const SIGN_LORDS = {
  1: { ta: "செவ்வாய்", en: "Mars" },
  2: { ta: "சுக்கிரன்", en: "Venus" },
  3: { ta: "புதன்", en: "Mercury" },
  4: { ta: "சந்திரன்", en: "Moon" },
  5: { ta: "சூரியன்", en: "Sun" },
  6: { ta: "புதன்", en: "Mercury" },
  7: { ta: "சுக்கிரன்", en: "Venus" },
  8: { ta: "செவ்வாய்", en: "Mars" },
  9: { ta: "குரு", en: "Jupiter" },
  10: { ta: "சனி", en: "Saturn" },
  11: { ta: "சனி", en: "Saturn" },
  12: { ta: "குரு", en: "Jupiter" },
};

function getSignLord(rasiNo, language = "ta") {
  return SIGN_LORDS[rasiNo][language];
}

function buildHouseLords(lagna, language = "ta") {
  const houseLords = {};

  for (let house = 1; house <= 12; house++) {
    const signNo = ((lagna.rasiNo + house - 2) % 12) + 1;

    houseLords[house.toString()] = {
      house,
      rasiNo: signNo,
      rasi: RASI[language][signNo - 1],
      lord: getSignLord(signNo, language),
    };
  }

  return houseLords;
}

const NAKSHATRA = {
  ta: [
    "அஸ்வினி",
    "பரணி",
    "கிருத்திகை",
    "ரோகிணி",
    "மிருகசீரிஷம்",
    "திருவாதிரை",
    "புனர்பூசம்",
    "பூசம்",
    "ஆயில்யம்",
    "மகம்",
    "பூரம்",
    "உத்திரம்",
    "ஹஸ்தம்",
    "சித்திரை",
    "சுவாதி",
    "விசாகம்",
    "அனுஷம்",
    "கேட்டை",
    "மூலம்",
    "பூராடம்",
    "உத்திராடம்",
    "திருவோணம்",
    "அவிட்டம்",
    "சதயம்",
    "பூரட்டாதி",
    "உத்திரட்டாதி",
    "ரேவதி",
  ],
  en: [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
  ],
};

const STRENGTH_LABELS = {
  ta: {
    exalted: "உச்சம்",
    debilitated: "நீசம்",
    own: "ஆட்சி",
    normal: "சாதாரணம்",
    node: "நிழல் கிரகம்",
  },
  en: {
    exalted: "Exalted",
    debilitated: "Debilitated",
    own: "Own Sign",
    normal: "Normal",
    node: "Shadow Planet",
  },
};

const OWN_SIGNS = {
  sun: [5],
  moon: [4],
  mars: [1, 8],
  mercury: [3, 6],
  jupiter: [9, 12],
  venus: [2, 7],
  saturn: [10, 11],
};

const EXALTED_SIGNS = {
  sun: 1,
  moon: 2,
  mars: 10,
  mercury: 6,
  jupiter: 4,
  venus: 12,
  saturn: 7,
};

const DEBILITATED_SIGNS = {
  sun: 7,
  moon: 8,
  mars: 4,
  mercury: 12,
  jupiter: 10,
  venus: 6,
  saturn: 1,
};

const COMBUST_LIMITS = {
  moon: 12,
  mars: 17,
  mercury: 14,
  jupiter: 11,
  venus: 10,
  saturn: 15,
};

function normalizeDegree(degree) {
  let value = degree % 360;
  if (value < 0) value += 360;
  return value;
}

function angularDistance(a, b) {
  const diff = Math.abs(normalizeDegree(a) - normalizeDegree(b));
  return Math.min(diff, 360 - diff);
}

function degreeToRasi(degree, language = "ta") {
  const index = Math.floor(degree / 30);
  return RASI[language][index];
}

function degreeToNakshatra(degree, language = "ta") {
  const index = Math.floor(degree / (360 / 27));
  return NAKSHATRA[language][index];
}

function degreeToPada(degree) {
  const nakshatraSize = 360 / 27;
  const padaSize = nakshatraSize / 4;
  const withinNakshatra = degree % nakshatraSize;
  return Math.floor(withinNakshatra / padaSize) + 1;
}

function getRasiNumber(degree) {
  return Math.floor(degree / 30) + 1;
}

function getPlanetStrength(key, rasiNo, language = "ta") {
  if (key === "rahu" || key === "ketu") {
    return STRENGTH_LABELS[language].node;
  }

  if (EXALTED_SIGNS[key] === rasiNo) {
    return STRENGTH_LABELS[language].exalted;
  }

  if (DEBILITATED_SIGNS[key] === rasiNo) {
    return STRENGTH_LABELS[language].debilitated;
  }

  if (OWN_SIGNS[key] && OWN_SIGNS[key].includes(rasiNo)) {
    return STRENGTH_LABELS[language].own;
  }

  return STRENGTH_LABELS[language].normal;
}

function isCombust(planet, sunLongitude) {
  if (!COMBUST_LIMITS[planet.key]) return false;
  const distance = angularDistance(planet.siderealLongitude, sunLongitude);
  return distance <= COMBUST_LIMITS[planet.key];
}

function isRetrograde(planet) {
  if (planet.key === "sun" || planet.key === "moon") return false;
  if (planet.key === "rahu" || planet.key === "ketu") return true;

  // astronomyService may later provide speed.
  // Until then, keep false to avoid false astrology claims.
  if (typeof planet.speed === "number") {
    return planet.speed < 0;
  }

  return false;
}

function enrichPlanets(planets, language = "ta") {
  const sun = planets.find((p) => p.key === "sun");
  const sunLongitude = sun ? sun.siderealLongitude : 0;

  return planets.map((planet) => {
    const rasiNo = getRasiNumber(planet.siderealLongitude);

    return {
      key: planet.key,
      name: language === "ta" ? planet.ta : planet.en,
      longitude: planet.siderealLongitude,
      rasi: degreeToRasi(planet.siderealLongitude, language),
      rasiNo,
      nakshatra: degreeToNakshatra(planet.siderealLongitude, language),
      pada: degreeToPada(planet.siderealLongitude),
      retrograde: isRetrograde(planet),
      combust: isCombust(planet, sunLongitude),
      strength: getPlanetStrength(planet.key, rasiNo, language),
    };
  });
}

function buildSouthIndianChart({ lagna, planets }) {
  const chart = {};

  for (let i = 1; i <= 12; i++) {
    chart[i.toString()] = [];
  }

  const lagnaRasi = getRasiNumber(lagna.longitude);
  chart[lagnaRasi.toString()].push(lagna.name);

  planets.forEach((planet) => {
    const rasiNo = getRasiNumber(planet.longitude);
    chart[rasiNo.toString()].push(planet.name);
  });

  const finalChart = {};

  for (let i = 1; i <= 12; i++) {
    finalChart[i.toString()] = chart[i.toString()].join("\n");
  }

  return finalChart;
}

function buildHouseChart({ lagna, planets }) {
  const houses = {};

  for (let i = 1; i <= 12; i++) {
    houses[i.toString()] = [];
  }

  const lagnaRasi = getRasiNumber(lagna.longitude);

  houses["1"].push(lagna.name);

  planets.forEach((planet) => {
    const planetRasi = getRasiNumber(planet.longitude);

    let houseNo = planetRasi - lagnaRasi + 1;

    if (houseNo <= 0) {
      houseNo += 12;
    }

    houses[houseNo.toString()].push(planet.name);
  });

  const finalHouses = {};

  for (let i = 1; i <= 12; i++) {
    finalHouses[i.toString()] = houses[i.toString()].join("\n");
  }

  return finalHouses;
}

/*
function getNavamsaRasiNumber(longitude) {
  const rasiNo = getRasiNumber(longitude);

  const degreeInSign = longitude % 30;

  const navamsaIndex = Math.floor(degreeInSign / (30 / 9));

  let startRasi;

  // Movable signs
  if ([1, 4, 7, 10].includes(rasiNo)) {
    startRasi = rasiNo;
  }
  // Fixed signs
  else if ([2, 5, 8, 11].includes(rasiNo)) {
    startRasi = ((rasiNo + 8 - 1) % 12) + 1;
  }
  // Dual signs
  else {
    startRasi = ((rasiNo + 4 - 1) % 12) + 1;
  }

  return ((startRasi + navamsaIndex - 1) % 12) + 1;
}
*/

function getNavamsaRasiNumber(longitude) {
  const signNo = Math.floor(longitude / 30) + 1;
  const degreeInSign = longitude % 30;
  const navamsaIndex = Math.floor(degreeInSign / (30 / 9)); // 3°20'

  let startSign;

  // Movable signs
  if ([1, 4, 7, 10].includes(signNo)) {
    startSign = signNo;
  }

  // Fixed signs
  else if ([2, 5, 8, 11].includes(signNo)) {
    startSign = signNo + 8;
  }

  // Dual signs
  else {
    startSign = signNo + 4;
  }

  while (startSign > 12) {
    startSign -= 12;
  }

  let navamsaRasi = startSign + navamsaIndex;

  while (navamsaRasi > 12) {
    navamsaRasi -= 12;
  }

  return navamsaRasi;
}




function buildNavamsaChart({ lagna, planets }) {
  const chart = {};

  for (let i = 1; i <= 12; i++) {
    chart[i.toString()] = [];
  }

  const lagnaNavamsa = getNavamsaRasiNumber(lagna.longitude);

  chart[lagnaNavamsa.toString()].push(lagna.name);

  planets.forEach((planet) => {
    const navamsaRasi = getNavamsaRasiNumber(planet.longitude);
    chart[navamsaRasi.toString()].push(planet.name);
  });

  const finalChart = {};

  for (let i = 1; i <= 12; i++) {
    finalChart[i.toString()] = chart[i.toString()].join("\n");
  }

  return finalChart;
}


function buildAspectEngine({ lagna, planets }) {
  const aspects = [];

  const aspectRules = {
    sun: [7],
    moon: [7],
    mercury: [7],
    venus: [7],
    rahu: [7],
    ketu: [7],
    mars: [4, 7, 8],
    jupiter: [5, 7, 9],
    saturn: [3, 7, 10],
  };

  planets.forEach((planet) => {
    const fromRasi = getRasiNumber(planet.longitude);
    const rules = aspectRules[planet.key] || [7];

    rules.forEach((aspectHouseOffset) => {
      let toRasi = fromRasi + aspectHouseOffset - 1;

      while (toRasi > 12) {
        toRasi -= 12;
      }

      aspects.push({
        fromKey: planet.key,
        from: planet.name,
        fromRasi,
        aspect: aspectHouseOffset,
        toRasi,
      });
    });
  });

  return aspects;
}




module.exports = {
  enrichPlanets,
  buildSouthIndianChart,
  buildHouseChart,
  buildNavamsaChart,
  buildAspectEngine,
  buildHouseLords,
};