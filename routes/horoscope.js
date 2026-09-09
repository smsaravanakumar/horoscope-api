const express = require("express");

const { getCoordinates } = require("../services/geocodeService");
const {
  getPlanetPositions,
  getMandiPosition,
} = require("../services/astronomyService");
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
const { calculateHoroscopeDetails } = require("../services/horoscopeDetailsService");
const { buildAdditionalAstroAnalysis } = require("../services/additionalAstroAnalysisService");

const router = express.Router();

const IST_OFFSET = "+05:30";

function padTwo(value) {
  return String(value).padStart(2, "0");
}

/**
 * Accepts the date formats currently used by the Flutter application:
 *   DD-MM-YYYY
 *   DD/MM/YYYY
 *   YYYY-MM-DD
 *
 * Returns a normalized YYYY-MM-DD value.
 */
function normalizeBirthDate(value) {
  const text = String(value || "").trim();

  let match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    validateDateParts(year, month, day);
    return `${year}-${padTwo(month)}-${padTwo(day)}`;
  }

  match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    validateDateParts(year, month, day);
    return `${year}-${padTwo(month)}-${padTwo(day)}`;
  }

  throw new Error(
    "Invalid birthDate format. Use DD-MM-YYYY, DD/MM/YYYY, or YYYY-MM-DD."
  );
}

function validateDateParts(year, month, day) {
  if (year < 1900 || year > 2200) {
    throw new Error("Birth year must be between 1900 and 2200.");
  }

  if (month < 1 || month > 12) {
    throw new Error("Invalid birth month.");
  }

  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > lastDay) {
    throw new Error("Invalid birth day.");
  }
}

/**
 * Accepts:
 *   7:52 AM
 *   07:52 AM
 *   19:52
 *   19:52:00
 *
 * Returns a normalized 24-hour HH:mm:ss value.
 */
function normalizeBirthTime(value) {
  const text = String(value || "").trim().toUpperCase();

  let match = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (match) {
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const second = Number(match[3] || 0);
    const meridiem = match[4];

    if (hour < 1 || hour > 12 || minute > 59 || second > 59) {
      throw new Error("Invalid birth time.");
    }

    if (meridiem === "AM" && hour === 12) hour = 0;
    if (meridiem === "PM" && hour !== 12) hour += 12;

    return `${padTwo(hour)}:${padTwo(minute)}:${padTwo(second)}`;
  }

  match = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const second = Number(match[3] || 0);

    if (hour > 23 || minute > 59 || second > 59) {
      throw new Error("Invalid birth time.");
    }

    return `${padTwo(hour)}:${padTwo(minute)}:${padTwo(second)}`;
  }

  throw new Error(
    "Invalid birthTime format. Use HH:mm, HH:mm:ss, or h:mm AM/PM."
  );
}

function buildBirthDateTime(birthDate, birthTime) {
  const normalizedDate = normalizeBirthDate(birthDate);
  const normalizedTime = normalizeBirthTime(birthTime);
  const isoDateTime = `${normalizedDate}T${normalizedTime}${IST_OFFSET}`;
  const jsDate = new Date(isoDateTime);

  if (Number.isNaN(jsDate.getTime())) {
    throw new Error("Unable to create a valid birth date and time.");
  }

  return {
    jsDate,
    normalizedDate,
    normalizedTime,
    isoDateTime,
  };
}

router.post("/generate", async (req, res) => {
  try {
    const {
      name,
      gender,
      birthDate,
      birthTime,
      place,
      language = "ta",
    } = req.body || {};

    if (!birthDate || !birthTime || !String(place || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "birthDate, birthTime and place are required.",
      });
    }

    if (!["ta", "en"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "language must be either ta or en.",
      });
    }

    // Convert the Flutter date/time values into one valid IST Date object.
    const birthDateTime = buildBirthDateTime(birthDate, birthTime);

    // Convert the place of birth into latitude and longitude.
    const coords = await getCoordinates(String(place).trim());

    if (
      !Number.isFinite(coords.latitude) ||
      !Number.isFinite(coords.longitude)
    ) {
      throw new Error("The birthplace coordinates are invalid.");
    }

    // Calculate the core sidereal planet positions and Lagna.
    const rawPlanets = getPlanetPositions(
      birthDateTime.jsDate,
      coords.latitude,
      coords.longitude
    );

    // Calculate and append Mandi without changing the existing planet flow.
    const mandiRaw = getMandiPosition(
      birthDateTime.jsDate,
      coords.latitude,
      coords.longitude,
      rawPlanets.ayanamsa
    );

    if (mandiRaw) {
      rawPlanets.planets.push(mandiRaw);
    }

    // Add Rasi, Nakshatra, Pada, degree and strength descriptions.
    const planets = enrichPlanets(rawPlanets.planets, language);
    const lagna = enrichPlanets([rawPlanets.lagna], language)[0];

    const moon = planets.find((planet) => planet.key === "moon");
    if (!moon) {
      throw new Error("Moon position could not be calculated.");
    }

    // Existing Vimshottari Dasha calculation.
    const dasha = calculateDasha({
      moonLongitude: moon.longitude,
      birthDate: birthDateTime.jsDate,
      language,
    });

    // Existing chart and astrology calculations.
    const chart = buildSouthIndianChart({ lagna, planets });
    const houseChart = buildHouseChart({ lagna, planets });
    const navamsaChart = buildNavamsaChart({ lagna, planets });
    const aspects = buildAspectEngine({ lagna, planets });
    const yogas = detectYogas({ lagna, planets, language });
    const doshas = detectDoshas({ lagna, planets, language });
    const remedies = buildRemedies({ planets, doshas, dasha, language });

    // Additional astrology outputs requested by the app. Existing calculations remain unchanged.
    const additionalAstroAnalysis = buildAdditionalAstroAnalysis({
      lagna,
      planets,
      dasha,
      doshas,
      yogas,
      language,
    });

    // New isolated Panchanga details. Existing chart and planet logic remains unchanged.
    const horoscopeDetails = calculateHoroscopeDetails({
      birthDate: birthDateTime.jsDate,
      planets,
      lagna,
      dasha,
      input: {
        birthDate,
        birthTime,
        place: String(place).trim(),
      },
      language,
    });

    return res.json({
      success: true,
      input: {
        name: name || "",
        gender: gender || "",
        birthDate,
        birthTime,
        place: String(place).trim(),
        language,
      },
      normalizedInput: {
        birthDate: birthDateTime.normalizedDate,
        birthTime: birthDateTime.normalizedTime,
        timeZone: "Asia/Kolkata",
        utcOffset: IST_OFFSET,
        isoDateTime: birthDateTime.isoDateTime,
      },
      coordinates: coords,
      ayanamsa: rawPlanets.ayanamsa,
      lagna,
      planets,
      dasha,
      additionalAstroAnalysis,
      horoscopeDetails,
      chart,
      houseChart,
      navamsaChart,
      aspects,
      yogas,
      doshas,
      remedies,
    });
  } catch (error) {
    console.error("Horoscope generation failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unexpected horoscope generation error.";

    const isInputError =
      message.startsWith("Invalid birth") ||
      message.startsWith("Birth year") ||
      message.startsWith("Unable to create");

    return res.status(isInputError ? 400 : 500).json({
      success: false,
      message,
    });
  }
});

module.exports = router;
