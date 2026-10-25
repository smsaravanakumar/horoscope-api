function getPlanet(planets, key) {
  return planets.find((p) => p.key === key);
}

function getHouseFromLagna(lagnaRasiNo, planetRasiNo) {
  let house = planetRasiNo - lagnaRasiNo + 1;

  while (house <= 0) {
    house += 12;
  }

  return house;
}

function detectSevvaiDosham({ lagna, planets, language = "ta" }) {
  const mars = getPlanet(planets, "mars");
  if (!mars) return null;

  const marsHouse = getHouseFromLagna(lagna.rasiNo, mars.rasiNo);

  const doshaHouses = [1, 2, 4, 7, 8, 12];

  if (doshaHouses.includes(marsHouse)) {
    return {
      key: "sevvai_dosham",
      name: language === "ta" ? "செவ்வாய் தோஷம்" : "Sevvai Dosham",
      result: true,
      house: marsHouse,
      severity:
        [7, 8].includes(marsHouse)
          ? language === "ta"
            ? "அதிகம்"
            : "High"
          : language === "ta"
          ? "மிதம்"
          : "Medium",
    };
  }

  return null;
}

function detectKalaSarpaDosha({ planets, language = "ta" }) {
  const rahu = getPlanet(planets, "rahu");
  const ketu = getPlanet(planets, "ketu");

  if (!rahu || !ketu) return null;

  const normalPlanets = planets.filter(
    (p) => !["rahu", "ketu"].includes(p.key)
  );

  const rahuDeg = rahu.longitude;
  const ketuDeg = ketu.longitude;

  function isBetweenArc(deg, start, end) {
    if (start < end) {
      return deg > start && deg < end;
    }
    return deg > start || deg < end;
  }

  const betweenRahuToKetu = normalPlanets.every((p) =>
    isBetweenArc(p.longitude, rahuDeg, ketuDeg)
  );

  const betweenKetuToRahu = normalPlanets.every((p) =>
    isBetweenArc(p.longitude, ketuDeg, rahuDeg)
  );

  if (betweenRahuToKetu || betweenKetuToRahu) {
    return {
      key: "kala_sarpa_dosha",
      name: language === "ta" ? "கால சர்ப்ப தோஷம்" : "Kala Sarpa Dosha",
      result: true,
    };
  }

  return null;
}

function detectKemadrumaDosha({ planets, language = "ta" }) {
  const moon = getPlanet(planets, "moon");
  if (!moon) return null;

  const moonRasi = moon.rasiNo;
  const previousRasi = moonRasi === 1 ? 12 : moonRasi - 1;
  const nextRasi = moonRasi === 12 ? 1 : moonRasi + 1;

  const planetsAroundMoon = planets.filter(
    (p) =>
      !["moon", "rahu", "ketu"].includes(p.key) &&
      [previousRasi, nextRasi].includes(p.rasiNo)
  );

  if (planetsAroundMoon.length === 0) {
    return {
      key: "kemadruma_dosha",
      name: language === "ta" ? "கேமத்ரும தோஷம்" : "Kemadruma Dosha",
      result: true,
    };
  }

  return null;
}

function detectShaniDosha({ lagna, planets, language = "ta" }) {
  const saturn = getPlanet(planets, "saturn");
  if (!saturn) return null;

  const saturnHouse = getHouseFromLagna(lagna.rasiNo, saturn.rasiNo);

  if ([1, 4, 7, 8, 10, 12].includes(saturnHouse)) {
    return {
      key: "shani_dosha",
      name: language === "ta" ? "சனி தோஷம்" : "Shani Dosha",
      result: true,
      house: saturnHouse,
      severity:
        [7, 8, 12].includes(saturnHouse)
          ? language === "ta"
            ? "அதிகம்"
            : "High"
          : language === "ta"
          ? "மிதம்"
          : "Medium",
    };
  }

  return null;
}

function detectRahuKetuDosha({ lagna, planets, language = "ta" }) {
  const rahu = getPlanet(planets, "rahu");
  const ketu = getPlanet(planets, "ketu");

  if (!rahu || !ketu) return null;

  const rahuHouse = getHouseFromLagna(lagna.rasiNo, rahu.rasiNo);
  const ketuHouse = getHouseFromLagna(lagna.rasiNo, ketu.rasiNo);

  if ([1, 2, 5, 7, 8, 9, 12].includes(rahuHouse) || [1, 2, 5, 7, 8, 9, 12].includes(ketuHouse)) {
    return {
      key: "rahu_ketu_dosha",
      name: language === "ta" ? "ராகு கேது தோஷம்" : "Rahu Ketu Dosha",
      result: true,
      rahuHouse,
      ketuHouse,
    };
  }

  return null;
}

function detectDoshas({ lagna, planets, language = "ta" }) {
  const doshas = [];

  const sevvai = detectSevvaiDosham({ lagna, planets, language });
  if (sevvai) doshas.push(sevvai);

  const kalaSarpa = detectKalaSarpaDosha({ planets, language });
  if (kalaSarpa) doshas.push(kalaSarpa);

  const kemadruma = detectKemadrumaDosha({ planets, language });
  if (kemadruma) doshas.push(kemadruma);

  const shani = detectShaniDosha({ lagna, planets, language });
  if (shani) doshas.push(shani);

  const rahuKetu = detectRahuKetuDosha({ lagna, planets, language });
  if (rahuKetu) doshas.push(rahuKetu);

  return doshas;
}

module.exports = {
  detectDoshas,
};