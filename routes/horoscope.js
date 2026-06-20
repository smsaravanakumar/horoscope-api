const express = require("express");

const { getCoordinates } = require("../services/geocodeService");
const { getPlanetPositions, getMandiPosition } = require("../services/astronomyService");
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

    // 1. Get exact location metrics
    const coords = await getCoordinates(place);

    // 2. Lock timezone parsing to India Standard Time (+05:30) to fix Thisai/Bhukti
    const jsDate = new Date(`${birthDate}T${birthTime}+05:30`);

    // 3. Fetch basic planet data and Lagnam
    const rawPlanets = getPlanetPositions(
      jsDate,
      coords.latitude,
      coords.longitude
    );

    // 4. Calculate Maandhi position and append it safely to the core planet list
    const mandiRaw = getMandiPosition(jsDate, coords.latitude, coords.longitude, rawPlanets.ayanamsa);
    if (mandiRaw) {
      rawPlanets.planets.push(mandiRaw);
    }

    // 5. Build full astrometric descriptors
    const planets = enrichPlanets(rawPlanets.planets, language);
    const lagna = enrichPlanets([rawPlanets.lagna], language)[0];

    // 6. Dasha engine
    const moon = planets.find((p) => p.key === "moon");
    const dasha = calculateDasha({
      moonLongitude: moon.longitude,
      birthDate: jsDate,
      language,
    });

    // 7. Graph charts out with Maandhi included
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

    // 8. Send structured response matching your Flutter app requirements
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
      
      // --- Flutter App expected mappings ---
      planets,         // Now contains Maandhi embedded inside it!
      dasha,           // Timezone-fixed accurate Dasha array
      chart,           // South Indian Rasi Chart map
      houseChart,      // Bhava/House Chart map
      navamsaChart,    // Navamsa Chart map
      
      // Keep these if your app uses them, or remove them if not needed:
      aspects,
      yogas,
      doshas,
      remedies,
    });

  /*
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
      dasha,
      charts: {
        rasi: chart,
        bhava: houseChart,
        navamsa: navamsaChart,
      },
      aspects,
      yogas,
      doshas,
      remedies,
    });

   */



  } catch (error) {
    console.error("Horoscope generation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;