const express = require("express");

const { getCoordinates } = require("../services/geocodeService");
const { getPlanetPositions } = require("../services/astronomyService");
const { detectYogas } = require("../services/yogaService");
const { detectDoshas } = require("../services/doshaService");
const { buildRemedies } = require("../services/remedyService");

const {
  enrichPlanets,
  buildSouthIndianChart,
  buildHouseChart,
  buildNavamsaChart,
  buildAspectEngine,
} = require("../services/astrologyService");

const { calculateDasha } = require("../services/dashaService");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const {
      name,
      gender,
      birthDate,
      birthTime,
      place,
      language = "ta",
    } = req.body;

    if (!birthDate || !birthTime || !place) {
      return res.status(400).json({
        success: false,
        message: "birthDate, birthTime, place required",
      });
    }

    const coords = await getCoordinates(place);

    const jsDate = new Date(`${birthDate} ${birthTime}`);

    const rawPlanets = getPlanetPositions(
      jsDate,
      coords.latitude,
      coords.longitude
    );

    const planets = enrichPlanets(rawPlanets.planets, language);

    const lagna = enrichPlanets([rawPlanets.lagna], language)[0];

    const moon = planets.find((p) => p.key === "moon");

    const dasha = calculateDasha({
      moonLongitude: moon.longitude,
      birthDate: jsDate,
      language,
    });

    const chart = buildSouthIndianChart({
      lagna,
      planets,
    });

    const houseChart = buildHouseChart({
  lagna,
  planets,
});

const navamsaChart = buildNavamsaChart({
  lagna,
  planets,
});

const aspects = buildAspectEngine({
  lagna,
  planets,
});

const yogas = detectYogas({
  lagna,
  planets,
  language,
});

const doshas = detectDoshas({
  lagna,
  planets,
  language,
});

const remedies = buildRemedies({
  planets,
  doshas,
  dasha,
  language,
});




    return res.json({
      success: true,
      input: {
        name,
        gender,
        birthDate,
        birthTime,
        place,
        language,
      },
      coordinates: coords,
      ayanamsa: rawPlanets.ayanamsa,
      lagna,
      chart,
      houseChart,
      navamsaChart,
      planets,
      dasha,
      aspects,
      yogas,
      doshas,
      remedies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Horoscope route working",
  });
});

module.exports = router;