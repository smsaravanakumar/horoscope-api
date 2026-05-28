function getPlanet(planets, key) {
  return planets.find((p) => p.key === key);
}

function getHouseFromLagna(lagnaRasi, planetRasi) {
  let house = planetRasi - lagnaRasi + 1;

  while (house <= 0) {
    house += 12;
  }

  return house;
}

function detectBudhaAditya(planets, language = "ta") {
  const sun = getPlanet(planets, "sun");
  const mercury = getPlanet(planets, "mercury");

  if (!sun || !mercury) return null;

  if (sun.rasiNo === mercury.rasiNo) {
    return {
      key: "budha_aditya",
      name: language === "ta" ? "புத ஆதித்ய யோகம்" : "Budha Aditya Yoga",
      result: true,
    };
  }

  return null;
}

function detectGajaKesari(planets, language = "ta") {
  const moon = getPlanet(planets, "moon");
  const jupiter = getPlanet(planets, "jupiter");

  if (!moon || !jupiter) return null;

  let diff = jupiter.rasiNo - moon.rasiNo;
  while (diff < 0) diff += 12;
  diff += 1;

  if ([1, 4, 7, 10].includes(diff)) {
    return {
      key: "gaja_kesari",
      name: language === "ta" ? "கஜ கேசரி யோகம்" : "Gaja Kesari Yoga",
      result: true,
    };
  }

  return null;
}

function detectChandraMangala(planets, language = "ta") {
  const moon = getPlanet(planets, "moon");
  const mars = getPlanet(planets, "mars");

  if (!moon || !mars) return null;

  let diff = mars.rasiNo - moon.rasiNo;
  while (diff < 0) diff += 12;
  diff += 1;

  if ([1, 7].includes(diff)) {
    return {
      key: "chandra_mangala",
      name: language === "ta" ? "சந்திர மங்கள யோகம்" : "Chandra Mangala Yoga",
      result: true,
    };
  }

  return null;
}

function detectNeecha(planets, language = "ta") {
  const neechaSigns = {
    sun: 7,
    moon: 8,
    mars: 4,
    mercury: 12,
    jupiter: 10,
    venus: 6,
    saturn: 1,
  };

  const results = [];

  planets.forEach((planet) => {
    if (neechaSigns[planet.key] === planet.rasiNo) {
      results.push({
        key: `${planet.key}_neecha`,
        name:
          language === "ta"
            ? `${planet.name} நீசம்`
            : `${planet.name} Debilitated`,
        result: true,
      });
    }
  });

  return results;
}

function detectRahuKetuAxis(planets, language = "ta") {
  const rahu = getPlanet(planets, "rahu");
  const ketu = getPlanet(planets, "ketu");

  if (!rahu || !ketu) return null;

  return {
    key: "rahu_ketu_axis",
    name:
      language === "ta"
        ? "ராகு கேது அச்சு"
        : "Rahu Ketu Axis",
    rahuRasi: rahu.rasi,
    ketuRasi: ketu.rasi,
  };
}

function detectYogas({ lagna, planets, language = "ta" }) {
  const yogas = [];

  const budhaAditya = detectBudhaAditya(planets, language);
  if (budhaAditya) yogas.push(budhaAditya);

  const gajaKesari = detectGajaKesari(planets, language);
  if (gajaKesari) yogas.push(gajaKesari);

  const chandraMangala = detectChandraMangala(planets, language);
  if (chandraMangala) yogas.push(chandraMangala);

  const neecha = detectNeecha(planets, language);
  yogas.push(...neecha);

  const axis = detectRahuKetuAxis(planets, language);
  if (axis) yogas.push(axis);

  return yogas;
}

module.exports = {
  detectYogas,
};