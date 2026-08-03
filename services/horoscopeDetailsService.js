const Astronomy = require("astronomy-engine");

const WEEKDAYS = {
  ta: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

const TITHI_NAMES = {
  ta: [
    "பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி", "சஷ்டி", "சப்தமி",
    "அஷ்டமி", "நவமி", "தசமி", "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்த்தசி",
    "பௌர்ணமி", "பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி", "சஷ்டி",
    "சப்தமி", "அஷ்டமி", "நவமி", "தசமி", "ஏகாதசி", "துவாதசி", "திரயோதசி",
    "சதுர்த்தசி", "அமாவாசை",
  ],
  en: [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami",
    "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
    "Purnima", "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti",
    "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi",
    "Chaturdashi", "Amavasya",
  ],
};

const YOGA_NAMES = {
  ta: [
    "விஷ்கம்பம்", "பிரீதி", "ஆயுஷ்மான்", "சௌபாக்கியம்", "சோபனம்", "அதிகண்டம்", "சுகர்மம்",
    "திருதி", "சூலம்", "கண்டம்", "விருத்தி", "துருவம்", "வியாகாதம்", "ஹர்ஷணம்",
    "வஜ்ரம்", "சித்தி", "வியதீபாதம்", "வரியான்", "பரிகம்", "சிவம்", "சித்தம்",
    "சாத்தியம்", "சுபம்", "சுப்பிரம்", "பிரம்மம்", "மகேந்திரம்", "வைதிருதி",
  ],
  en: [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
    "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana",
    "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha",
    "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
  ],
};

const KARANA_NAMES = {
  ta: {
    kimstughna: "கிம்ஸ்துக்னம்", bava: "பவம்", balava: "பாலவம்", kaulava: "கௌலவம்",
    taitila: "தைதுலம்", gara: "கரசை", vanija: "வணிசை", vishti: "பத்திரை",
    shakuni: "சகுனி", chatushpada: "சதுஷ்பாதம்", naga: "நாகவம்",
  },
  en: {
    kimstughna: "Kimstughna", bava: "Bava", balava: "Balava", kaulava: "Kaulava",
    taitila: "Taitila", gara: "Gara", vanija: "Vanija", vishti: "Vishti",
    shakuni: "Shakuni", chatushpada: "Chatushpada", naga: "Naga",
  },
};

const TAMIL_MONTHS = {
  ta: ["சித்திரை", "வைகாசி", "ஆனி", "ஆடி", "ஆவணி", "புரட்டாசி", "ஐப்பசி", "கார்த்திகை", "மார்கழி", "தை", "மாசி", "பங்குனி"],
  en: ["Chithirai", "Vaikasi", "Aani", "Aadi", "Avani", "Purattasi", "Aippasi", "Karthigai", "Margazhi", "Thai", "Maasi", "Panguni"],
};


const NAKSHATRA_NAMES = {
  ta: [
    "அஸ்வினி", "பரணி", "கிருத்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை",
    "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
    "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
    "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
    "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி",
  ],
  en: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
  ],
};

const RASI_NAMES = {
  ta: ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"],
  en: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
};

const NAKSHATRA_LORD_KEYS = [
  "ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury",
];

const PLANET_NAMES = {
  ta: {
    sun: "சூரியன்", moon: "சந்திரன்", mars: "செவ்வாய்", mercury: "புதன்",
    jupiter: "குரு", venus: "சுக்கிரன்", saturn: "சனி", rahu: "ராகு", ketu: "கேது",
  },
  en: {
    sun: "Sun", moon: "Moon", mars: "Mars", mercury: "Mercury",
    jupiter: "Jupiter", venus: "Venus", saturn: "Saturn", rahu: "Rahu", ketu: "Ketu",
  },
};

const IST_TIME_ZONE = "Asia/Kolkata";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function normalizeDegree(value) {
  let result = value % 360;
  if (result < 0) result += 360;
  return result;
}

function getLahiriAyanamsa(date) {
  const year =
    date.getUTCFullYear() +
    (date.getUTCMonth() + 1) / 12 +
    date.getUTCDate() / 365.25;

  return 23.85675 + (year - 2000) * 0.013968;
}

function getSiderealSunLongitude(date) {
  const tropicalLongitude = normalizeDegree(Astronomy.SunPosition(date).elon);
  return normalizeDegree(tropicalLongitude - getLahiriAyanamsa(date));
}

function getIstParts(date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekdayIndex: weekdayMap[parts.weekday],
  };
}

function utcDateFromIstDateParts(year, month, day) {
  // Midnight in IST equals 18:30 UTC on the previous Gregorian date.
  return new Date(Date.UTC(year, month - 1, day, -5, -30, 0));
}

function dateOnlySerial(parts) {
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

function findCurrentSolarIngress(birthDate, currentSolarSignIndex) {
  const currentSignStart = currentSolarSignIndex * 30;
  let newerTime = birthDate.getTime();
  let olderTime = newerTime - ONE_DAY_MS;

  // Scan backward until the Sun is no longer in the birth-time solar sign.
  for (let day = 0; day < 40; day += 1) {
    const olderLongitude = getSiderealSunLongitude(new Date(olderTime));
    const olderSignIndex = Math.floor(olderLongitude / 30);

    if (olderSignIndex !== currentSolarSignIndex) {
      break;
    }

    newerTime = olderTime;
    olderTime -= ONE_DAY_MS;
  }

  if (Math.floor(getSiderealSunLongitude(new Date(olderTime)) / 30) === currentSolarSignIndex) {
    throw new Error("Unable to locate the Tamil solar month ingress.");
  }

  // Binary-search the exact ingress instant to about one second.
  let low = olderTime;
  let high = newerTime;
  for (let i = 0; i < 50; i += 1) {
    const middle = (low + high) / 2;
    const middleLongitude = getSiderealSunLongitude(new Date(middle));
    const middleSignIndex = Math.floor(middleLongitude / 30);

    if (middleSignIndex === currentSolarSignIndex) {
      high = middle;
    } else {
      low = middle;
    }
  }

  const ingressDate = new Date(high);
  return {
    date: ingressDate,
    longitude: getSiderealSunLongitude(ingressDate),
    targetLongitude: currentSignStart,
  };
}

function getEffectiveTamilMonthStart(ingress) {
  const ingressIst = getIstParts(ingress.date);

  // Tamil solar dates are assigned by the sunrise-day convention. Until the
  // next sunrise, an ingress that happened after sunrise still belongs to the
  // previous Tamil solar month for calendar-date purposes.
  const ingressOccurredAfterSunrise =
    ingressIst.hour > 6 ||
    (ingressIst.hour === 6 &&
      (ingressIst.minute > 0 || ingressIst.second > 0));

  const effectiveMonthStartSerial =
    dateOnlySerial(ingressIst) +
    (ingressOccurredAfterSunrise ? ONE_DAY_MS : 0);

  return {
    ingressIst,
    ingressOccurredAfterSunrise,
    effectiveMonthStartSerial,
  };
}

function formatIstDate(parts) {
  return `${String(parts.day).padStart(2, "0")}-${String(parts.month).padStart(2, "0")}-${parts.year}`;
}

function formatIstDateTime(parts) {
  return `${formatIstDate(parts)} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
}

function getTamilSolarDate(date, sunLongitude, language = "ta") {
  const normalizedSunLongitude = normalizeDegree(sunLongitude);
  const observedSolarSignIndex = Math.floor(normalizedSunLongitude / 30);
  const birthIst = getIstParts(date);
  const birthSerial = dateOnlySerial(birthIst);

  let calendarSolarSignIndex = observedSolarSignIndex;
  let ingress = findCurrentSolarIngress(date, observedSolarSignIndex);
  let monthStart = getEffectiveTamilMonthStart(ingress);
  let usedPreviousMonthAfterLateIngress = false;

  // Important PM/late-ingress correction:
  // If the Sun entered a new sidereal sign after sunrise on the birth date,
  // the Tamil calendar does not start the new month until the next sunrise.
  // A birth later that same evening therefore still belongs to the previous
  // Tamil month. The old code selected the new solar sign immediately and
  // produced day 0, causing:
  //   "Calculated Tamil solar date is outside the expected range."
  if (birthSerial < monthStart.effectiveMonthStartSerial) {
    usedPreviousMonthAfterLateIngress = true;
    calendarSolarSignIndex = (observedSolarSignIndex + 11) % 12;

    // Move just before the current ingress and locate the previous sign's
    // ingress. One minute is used instead of one millisecond to avoid any
    // floating-point boundary ambiguity in the astronomy calculation.
    const beforeCurrentIngress = new Date(ingress.date.getTime() - 60 * 1000);
    ingress = findCurrentSolarIngress(
      beforeCurrentIngress,
      calendarSolarSignIndex
    );
    monthStart = getEffectiveTamilMonthStart(ingress);
  }

  const tamilDay =
    Math.floor(
      (birthSerial - monthStart.effectiveMonthStartSerial) / ONE_DAY_MS
    ) + 1;

  if (tamilDay < 1 || tamilDay > 33) {
    throw new Error(
      `Calculated Tamil solar date is outside the expected range: ${tamilDay}.`
    );
  }

  const effectiveStartDate = new Date(monthStart.effectiveMonthStartSerial);
  const effectiveStartText = `${String(effectiveStartDate.getUTCDate()).padStart(2, "0")}-${String(effectiveStartDate.getUTCMonth() + 1).padStart(2, "0")}-${effectiveStartDate.getUTCFullYear()}`;

  return {
    month: TAMIL_MONTHS[language][calendarSolarSignIndex],
    monthIndex: calendarSolarSignIndex + 1,
    day: tamilDay,
    text: `${TAMIL_MONTHS[language][calendarSolarSignIndex]} ${tamilDay}`,
    solarSignIndex: calendarSolarSignIndex + 1,
    observedSolarSignIndex: observedSolarSignIndex + 1,
    sunLongitude: normalizedSunLongitude,
    ingress: {
      isoUtc: ingress.date.toISOString(),
      localIst: formatIstDateTime(monthStart.ingressIst),
      targetLongitude: ingress.targetLongitude,
      calculatedLongitude: ingress.longitude,
      afterConventionalSunrise: monthStart.ingressOccurredAfterSunrise,
      effectiveMonthStartIst: effectiveStartText,
    },
    usedPreviousMonthAfterLateIngress,
    calculationMethod:
      "astronomical-sidereal-solar-ingress-sunrise-rollover-v2",
  };
}

function getKarana(halfTithiIndex, language = "ta") {
  const labels = KARANA_NAMES[language];

  if (halfTithiIndex === 0) return labels.kimstughna;
  if (halfTithiIndex >= 57) {
    return [labels.shakuni, labels.chatushpada, labels.naga][halfTithiIndex - 57];
  }

  const repeating = [
    labels.bava, labels.balava, labels.kaulava, labels.taitila,
    labels.gara, labels.vanija, labels.vishti,
  ];
  return repeating[(halfTithiIndex - 1) % 7];
}


function getNakshatraIndexFromLongitude(longitude) {
  return Math.floor(normalizeDegree(longitude) / (360 / 27));
}

function getNakshatraLordKey(nakshatraIndex) {
  return NAKSHATRA_LORD_KEYS[nakshatraIndex % 9];
}

function calculateYogiAvayogi(yogaNumber, language = "ta") {
  const yogaSequenceIndex = yogaNumber - 1;
  const yogiNakshatraIndex = (yogaSequenceIndex + 7) % 27;
  const avayogiNakshatraIndex = (yogaSequenceIndex + 21) % 27;
  const yogiPlanetKey = getNakshatraLordKey(yogiNakshatraIndex);
  const avayogiPlanetKey = getNakshatraLordKey(avayogiNakshatraIndex);

  return {
    yogi: {
      nakshatraNumber: yogiNakshatraIndex + 1,
      nakshatra: NAKSHATRA_NAMES[language][yogiNakshatraIndex],
      planetKey: yogiPlanetKey,
      planet: PLANET_NAMES[language][yogiPlanetKey],
    },
    avayogi: {
      nakshatraNumber: avayogiNakshatraIndex + 1,
      nakshatra: NAKSHATRA_NAMES[language][avayogiNakshatraIndex],
      planetKey: avayogiPlanetKey,
      planet: PLANET_NAMES[language][avayogiPlanetKey],
    },
    calculationMethod: "nitya-yoga-8th-and-22nd-nakshatra",
  };
}

function calculateMudakku(sunLongitude, language = "ta") {
  const sunNakshatraIndex = getNakshatraIndexFromLongitude(sunLongitude);
  const mulaIndex = 18;
  const purvaAshadhaIndex = 19;

  const countToMulaInclusive = ((mulaIndex - sunNakshatraIndex + 27) % 27) + 1;
  const mudakkuNakshatraIndex =
    (purvaAshadhaIndex + countToMulaInclusive - 1) % 27;

  const nakshatraStartLongitude = mudakkuNakshatraIndex * (360 / 27);
  const rasiIndex = Math.floor(nakshatraStartLongitude / 30);

  return {
    sunNakshatraNumber: sunNakshatraIndex + 1,
    sunNakshatra: NAKSHATRA_NAMES[language][sunNakshatraIndex],
    countToMulaInclusive,
    nakshatraNumber: mudakkuNakshatraIndex + 1,
    nakshatra: NAKSHATRA_NAMES[language][mudakkuNakshatraIndex],
    rasiNumber: rasiIndex + 1,
    rasi: RASI_NAMES[language][rasiIndex],
    calculationMethod: "count-sun-nakshatra-to-mula-then-from-purva-ashadha",
  };
}

function buildConsolidatedSummary({
  language, input, weekday, tamilDate, paksha, tithi, karana, panchangaYoga,
  moon, lagna, yogiAvayogi, mudakku, dasha,
}) {
  const dateText = input?.birthDate || "";
  const timeText = input?.birthTime || "";
  const placeText = input?.place || "";

  const lines = language === "ta"
    ? [
        `பிறந்த தேதி: ${dateText}`,
        `பிறந்த நேரம்: ${timeText}`,
        `பிறந்த இடம்: ${placeText}`,
        `பிறந்த தமிழ் மாதம் & தேதி: ${tamilDate.text}`,
        `பிறந்த கிழமை: ${weekday.name}`,
        `பிறந்த நட்சத்திரம்: ${moon.nakshatra}`,
        `பிறந்த நட்சத்திர பாதம்: ${moon.pada}`,
        `பிறந்த ராசி: ${moon.rasi}`,
        `பிறந்த லக்னம்: ${lagna.rasi}`,
        `பிறந்த பிறை: ${paksha.name}`,
        `பிறந்த திதி: ${tithi.name}`,
        `பிறந்த கரணம்: ${karana.name}`,
        `பிறந்த யோகம்: ${panchangaYoga.name}`,
        `யோகி கிரகம்: ${yogiAvayogi.yogi.planet}`,
        `யோகி நட்சத்திரம்: ${yogiAvayogi.yogi.nakshatra}`,
        `அவயோகி கிரகம்: ${yogiAvayogi.avayogi.planet}`,
        `அவயோகி நட்சத்திரம்: ${yogiAvayogi.avayogi.nakshatra}`,
        `முடக்கு ராசி: ${mudakku.rasi}`,
        `முடக்கு நட்சத்திரம்: ${mudakku.nakshatra}`,
        `பிறந்த திசை: ${dasha?.birthDasha || ""}`,
        `நடப்பு திசை: ${dasha?.currentDasha || ""}`,
        `நடப்பு புத்தி: ${dasha?.currentBhukti || ""}`,
      ]
    : [
        `Date of birth: ${dateText}`,
        `Time of birth: ${timeText}`,
        `Place of birth: ${placeText}`,
        `Tamil solar date: ${tamilDate.text}`,
        `Weekday: ${weekday.name}`,
        `Birth star: ${moon.nakshatra}`,
        `Birth star pada: ${moon.pada}`,
        `Moon sign: ${moon.rasi}`,
        `Ascendant: ${lagna.rasi}`,
        `Paksha: ${paksha.name}`,
        `Tithi: ${tithi.name}`,
        `Karana: ${karana.name}`,
        `Nitya Yoga: ${panchangaYoga.name}`,
        `Yogi planet: ${yogiAvayogi.yogi.planet}`,
        `Yogi star: ${yogiAvayogi.yogi.nakshatra}`,
        `Avayogi planet: ${yogiAvayogi.avayogi.planet}`,
        `Avayogi star: ${yogiAvayogi.avayogi.nakshatra}`,
        `Mudakku sign: ${mudakku.rasi}`,
        `Mudakku star: ${mudakku.nakshatra}`,
        `Birth Dasha: ${dasha?.birthDasha || ""}`,
        `Current Dasha: ${dasha?.currentDasha || ""}`,
        `Current Bhukti: ${dasha?.currentBhukti || ""}`,
      ];

  return { lines, text: lines.join("\n") };
}

function calculateHoroscopeDetails({ birthDate, planets, lagna, dasha, input, language = "ta" }) {
  if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
    throw new Error("A valid birthDate is required for horoscope details.");
  }

  if (!Array.isArray(planets)) {
    throw new Error("Planet positions are required for horoscope details.");
  }

  if (!lagna || !Number.isFinite(lagna.longitude)) {
    throw new Error("Lagna is required for horoscope details.");
  }

  if (!["ta", "en"].includes(language)) {
    throw new Error("language must be either ta or en.");
  }

  const sun = planets.find((planet) => planet.key === "sun");
  const moon = planets.find((planet) => planet.key === "moon");
  if (!sun || !moon) {
    throw new Error("Sun and Moon positions are required for horoscope details.");
  }

  const sunLongitude = normalizeDegree(sun.longitude);
  const moonLongitude = normalizeDegree(moon.longitude);
  const lunarElongation = normalizeDegree(moonLongitude - sunLongitude);

  const tithiNumber = Math.floor(lunarElongation / 12) + 1;
  const paksha = tithiNumber <= 15
    ? { key: "shukla", ta: "வளர்பிறை", en: "Waxing Moon" }
    : { key: "krishna", ta: "தேய்பிறை", en: "Waning Moon" };

  const halfTithiIndex = Math.floor(lunarElongation / 6);
  const yogaLongitude = normalizeDegree(sunLongitude + moonLongitude);
  const yogaNumber = Math.floor(yogaLongitude / (360 / 27)) + 1;
  const ist = getIstParts(birthDate);
  const tamilDate = getTamilSolarDate(birthDate, sunLongitude, language);

  const weekday = {
    number: ist.weekdayIndex + 1,
    name: WEEKDAYS[language][ist.weekdayIndex],
  };
  const pakshaResult = { key: paksha.key, name: paksha[language] };
  const tithi = {
    number: tithiNumber,
    pakshaNumber: tithiNumber <= 15 ? tithiNumber : tithiNumber - 15,
    name: TITHI_NAMES[language][tithiNumber - 1],
    lunarElongation,
  };
  const karana = {
    number: halfTithiIndex + 1,
    name: getKarana(halfTithiIndex, language),
  };
  const panchangaYoga = {
    number: yogaNumber,
    name: YOGA_NAMES[language][yogaNumber - 1],
    longitude: yogaLongitude,
  };
  const yogiAvayogi = calculateYogiAvayogi(yogaNumber, language);
  const mudakku = calculateMudakku(sunLongitude, language);
  const summary = buildConsolidatedSummary({
    language, input, weekday, tamilDate, paksha: pakshaResult, tithi, karana,
    panchangaYoga, moon, lagna, yogiAvayogi, mudakku, dasha,
  });

  return {
    weekday,
    tamilDate,
    paksha: pakshaResult,
    tithi,
    karana,
    panchangaYoga,
    yogiAvayogi,
    mudakku,
    summary,
  };
}

module.exports = {
  calculateHoroscopeDetails,
};
