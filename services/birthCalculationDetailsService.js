const Astronomy = require('astronomy-engine');
const { getPlanetPositions } = require('./astronomyService');

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const NAKSHATRA_SIZE = 360 / 27;

const NAKSHATRA_LORD_KEYS = [
  'ketu',
  'venus',
  'sun',
  'moon',
  'mars',
  'rahu',
  'jupiter',
  'saturn',
  'mercury',
];

const PLANET_NAMES = {
  ta: {
    lagna: 'லக்னம்',
    sun: 'சூரியன்',
    moon: 'சந்திரன்',
    mars: 'செவ்வாய்',
    mercury: 'புதன்',
    jupiter: 'குரு',
    venus: 'சுக்கிரன்',
    saturn: 'சனி',
    rahu: 'ராகு',
    ketu: 'கேது',
    mandi: 'மாந்தி',
  },
  en: {
    lagna: 'Lagna',
    sun: 'Sun',
    moon: 'Moon',
    mars: 'Mars',
    mercury: 'Mercury',
    jupiter: 'Jupiter',
    venus: 'Venus',
    saturn: 'Saturn',
    rahu: 'Rahu',
    ketu: 'Ketu',
    mandi: 'Mandi',
  },
};

const RELATIONSHIP_LABELS = {
  ta: {
    exalted: 'உச்சம்',
    debilitated: 'நீசம்',
    own: 'ஆட்சி',
    friend: 'நட்பு',
    neutral: 'சமம்',
    enemy: 'பகை',
    notApplicable: '---',
  },
  en: {
    exalted: 'Exalted',
    debilitated: 'Debilitated',
    own: 'Own Sign',
    friend: 'Friendly',
    neutral: 'Neutral',
    enemy: 'Enemy',
    notApplicable: '---',
  },
};

const SIGN_LORD_KEYS = {
  1: 'mars',
  2: 'venus',
  3: 'mercury',
  4: 'moon',
  5: 'sun',
  6: 'mercury',
  7: 'venus',
  8: 'mars',
  9: 'jupiter',
  10: 'saturn',
  11: 'saturn',
  12: 'jupiter',
};

const NATURAL_RELATIONSHIPS = {
  sun: {
    friend: ['moon', 'mars', 'jupiter'],
    neutral: ['mercury'],
    enemy: ['venus', 'saturn'],
  },
  moon: {
    friend: ['sun', 'mercury'],
    neutral: ['mars', 'jupiter', 'venus', 'saturn'],
    enemy: [],
  },
  mars: {
    friend: ['sun', 'moon', 'jupiter'],
    neutral: ['venus', 'saturn'],
    enemy: ['mercury'],
  },
  mercury: {
    friend: ['sun', 'venus'],
    neutral: ['mars', 'jupiter', 'saturn'],
    enemy: ['moon'],
  },
  jupiter: {
    friend: ['sun', 'moon', 'mars'],
    neutral: ['saturn'],
    enemy: ['mercury', 'venus'],
  },
  venus: {
    friend: ['mercury', 'saturn'],
    neutral: ['mars', 'jupiter'],
    enemy: ['sun', 'moon'],
  },
  saturn: {
    friend: ['mercury', 'venus'],
    neutral: ['jupiter'],
    enemy: ['sun', 'moon', 'mars'],
  },
};

const DASHA_KEYS = [
  'ketu',
  'venus',
  'sun',
  'moon',
  'mars',
  'rahu',
  'jupiter',
  'saturn',
  'mercury',
];

const DASHA_YEARS = {
  ketu: 7,
  venus: 20,
  sun: 6,
  moon: 10,
  mars: 7,
  rahu: 18,
  jupiter: 16,
  saturn: 19,
  mercury: 17,
};

function normalizeDegree(value) {
  let normalized = Number(value) % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

function roundDateToSecond(date) {
  return new Date(Math.round(date.getTime() / 1000) * 1000);
}

function roundDateToMinute(date) {
  return new Date(Math.round(date.getTime() / (60 * 1000)) * 60 * 1000);
}

function getIstParts(date) {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  };
}

function formatLocalTime(date, includeSeconds = false) {
  const parts = getIstParts(date);
  const hh = String(parts.hour).padStart(2, '0');
  const mm = String(parts.minute).padStart(2, '0');
  const ss = String(parts.second).padStart(2, '0');
  return includeSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

function formatLocalDate(date) {
  const parts = getIstParts(date);
  return `${String(parts.day).padStart(2, '0')}-${String(parts.month).padStart(2, '0')}-${parts.year}`;
}

function formatDms(value) {
  let normalized = normalizeDegree(value);
  let degree = Math.floor(normalized);
  let minuteFloat = (normalized - degree) * 60;
  let minute = Math.floor(minuteFloat);
  let second = Math.round((minuteFloat - minute) * 60);

  if (second === 60) {
    second = 0;
    minute += 1;
  }
  if (minute === 60) {
    minute = 0;
    degree = (degree + 1) % 360;
  }

  return {
    degree,
    minute,
    second,
    text: `${degree}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
  };
}

function formatNazhigaiFromSeconds(totalSeconds) {
  const totalVinadi = Math.max(0, Math.round(totalSeconds / 24));
  let nazhigai = Math.floor(totalVinadi / 60);
  let vinadi = totalVinadi % 60;

  if (vinadi === 60) {
    nazhigai += 1;
    vinadi = 0;
  }

  return {
    nazhigai,
    vinadi,
    text: `${nazhigai}.${String(vinadi).padStart(2, '0')}`,
  };
}

function searchRiseSetEvents(observer, direction, startDate, count = 4) {
  const events = [];
  let cursor = new Date(startDate.getTime());

  for (let index = 0; index < count; index += 1) {
    const event = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      direction,
      cursor,
      3
    );
    if (!event || !event.date) break;
    events.push(event.date);
    cursor = new Date(event.date.getTime() + 60 * 1000);
  }

  return events;
}

function getGoverningSunriseSunset(birthDate, latitude, longitude) {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const searchStart = new Date(birthDate.getTime() - 42 * 60 * 60 * 1000);
  const sunrises = searchRiseSetEvents(observer, +1, searchStart, 5);
  const sunsets = searchRiseSetEvents(observer, -1, searchStart, 5);
  const birthMs = birthDate.getTime();

  const sunrise = [...sunrises]
    .reverse()
    .find((item) => item.getTime() <= birthMs);

  if (!sunrise) {
    throw new Error('Unable to determine sunrise for the birth place/date.');
  }

  const sunset = sunsets.find(
    (item) => item.getTime() > sunrise.getTime() && item.getTime() < sunrise.getTime() + DAY_MS
  );

  if (!sunset) {
    throw new Error('Unable to determine sunset for the birth place/date.');
  }

  return {
    sunrise: roundDateToSecond(sunrise),
    sunset: roundDateToSecond(sunset),
  };
}

function moonSiderealLongitude(date, latitude, longitude) {
  const positions = getPlanetPositions(date, latitude, longitude);
  const moon = positions.planets.find((planet) => planet.key === 'moon');
  if (!moon) throw new Error('Moon position is unavailable.');
  return normalizeDegree(moon.siderealLongitude);
}

function nakshatraIndexAt(date, latitude, longitude) {
  return Math.floor(moonSiderealLongitude(date, latitude, longitude) / NAKSHATRA_SIZE);
}

function findNakshatraBoundary({ birthDate, latitude, longitude, direction }) {
  const birthIndex = nakshatraIndexAt(birthDate, latitude, longitude);
  const stepMs = 3 * 60 * 60 * 1000;
  let insideTime = birthDate.getTime();

  for (let step = 0; step < 20; step += 1) {
    const outsideTime = insideTime + direction * stepMs;
    const outsideIndex = nakshatraIndexAt(
      new Date(outsideTime),
      latitude,
      longitude
    );

    if (outsideIndex !== birthIndex) {
      let low = Math.min(insideTime, outsideTime);
      let high = Math.max(insideTime, outsideTime);
      const lowIndex = nakshatraIndexAt(new Date(low), latitude, longitude);

      for (let i = 0; i < 42; i += 1) {
        const middle = (low + high) / 2;
        const middleIndex = nakshatraIndexAt(
          new Date(middle),
          latitude,
          longitude
        );
        if (middleIndex === lowIndex) {
          low = middle;
        } else {
          high = middle;
        }
      }

      return roundDateToSecond(new Date((low + high) / 2));
    }

    insideTime = outsideTime;
  }

  throw new Error('Unable to determine Nakshatra start/end boundary.');
}

function getNakshatraDuration(birthDate, latitude, longitude, moon) {
  const start = findNakshatraBoundary({
    birthDate,
    latitude,
    longitude,
    direction: -1,
  });
  const end = findNakshatraBoundary({
    birthDate,
    latitude,
    longitude,
    direction: +1,
  });
  const durationSeconds = (end.getTime() - start.getTime()) / 1000;

  return {
    nakshatra: moon.nakshatra,
    pada: moon.pada,
    startIsoUtc: start.toISOString(),
    startIst: `${formatLocalDate(start)} ${formatLocalTime(start, true)}`,
    endIsoUtc: end.toISOString(),
    endIst: `${formatLocalDate(end)} ${formatLocalTime(end, true)}`,
    durationSeconds,
    ...formatNazhigaiFromSeconds(durationSeconds),
    calculationMethod: 'sidereal-moon-nakshatra-boundary-duration',
  };
}

function strengthKey(planet) {
  const strength = String(planet.strength || '').toLowerCase();
  if (strength.includes('உச்ச') || strength.includes('exalt')) return 'exalted';
  if (strength.includes('நீச') || strength.includes('debil')) return 'debilitated';
  if (strength.includes('ஆட்சி') || strength.includes('own sign')) return 'own';
  return null;
}

function getRelationship(planet, language) {
  const labels = RELATIONSHIP_LABELS[language];
  if (!planet || planet.key === 'lagna' || planet.key === 'rahu' || planet.key === 'ketu' || planet.key === 'mandi') {
    return { key: 'notApplicable', text: labels.notApplicable };
  }

  const special = strengthKey(planet);
  if (special) return { key: special, text: labels[special] };

  const signLord = SIGN_LORD_KEYS[planet.rasiNo];
  const rules = NATURAL_RELATIONSHIPS[planet.key];
  if (!signLord || !rules) {
    return { key: 'notApplicable', text: labels.notApplicable };
  }

  if (rules.friend.includes(signLord)) return { key: 'friend', text: labels.friend };
  if (rules.enemy.includes(signLord)) return { key: 'enemy', text: labels.enemy };
  return { key: 'neutral', text: labels.neutral };
}

function getNakshatraLord(planet, language) {
  const index = Math.floor(normalizeDegree(planet.longitude) / NAKSHATRA_SIZE);
  const lordKey = NAKSHATRA_LORD_KEYS[index % 9];
  return {
    key: lordKey,
    name: PLANET_NAMES[language][lordKey],
  };
}

function buildPlanetaryTable({ lagna, planets, language }) {
  const preferredOrder = [
    'lagna',
    'sun',
    'moon',
    'mars',
    'mercury',
    'jupiter',
    'venus',
    'saturn',
    'rahu',
    'ketu',
    'mandi',
  ];
  const all = [lagna, ...planets].filter(Boolean);
  const byKey = new Map(all.map((planet) => [planet.key, planet]));

  return preferredOrder
    .map((key) => byKey.get(key))
    .filter(Boolean)
    .map((planet) => {
      const nakshatraLord = getNakshatraLord(planet, language);
      const relationship = getRelationship(planet, language);
      const longitudeDms = formatDms(planet.longitude);

      return {
        key: planet.key,
        name: PLANET_NAMES[language][planet.key] || planet.name,
        longitude: planet.longitude,
        longitudeDms,
        nakshatra: planet.nakshatra,
        pada: planet.pada,
        nakshatraLord,
        rasi: planet.rasi,
        rasiNo: planet.rasiNo,
        relationship,
      };
    });
}

function getBirthDashaState(moonLongitude) {
  const nakshatraIndex = Math.floor(normalizeDegree(moonLongitude) / NAKSHATRA_SIZE);
  const lordIndex = nakshatraIndex % 9;
  const lordKey = DASHA_KEYS[lordIndex];
  const nakshatraStart = nakshatraIndex * NAKSHATRA_SIZE;
  const progressed = normalizeDegree(moonLongitude) - nakshatraStart;
  const progressRatio = progressed / NAKSHATRA_SIZE;
  const totalYears = DASHA_YEARS[lordKey];
  return {
    lordIndex,
    lordKey,
    totalYears,
    elapsedYearsAtBirth: totalYears * progressRatio,
    balanceYearsAtBirth: totalYears * (1 - progressRatio),
  };
}

function yearsToMs(years) {
  return years * 365.25 * DAY_MS;
}

function buildDashaTimeline({ birthDate, moon, dasha, language, currentDate = new Date() }) {
  const birthState = getBirthDashaState(moon.longitude);
  let dashaStart = new Date(
    birthDate.getTime() - yearsToMs(birthState.elapsedYearsAtBirth)
  );
  let currentDasha = null;
  let currentDashaIndex = birthState.lordIndex;

  for (let cycle = 0; cycle < 18; cycle += 1) {
    const key = DASHA_KEYS[currentDashaIndex];
    const dashaEnd = new Date(
      dashaStart.getTime() + yearsToMs(DASHA_YEARS[key])
    );
    if (currentDate >= dashaStart && currentDate < dashaEnd) {
      currentDasha = { key, start: dashaStart, end: dashaEnd };
      break;
    }
    dashaStart = dashaEnd;
    currentDashaIndex = (currentDashaIndex + 1) % 9;
  }

  if (!currentDasha) {
    throw new Error('Unable to determine current Vimshottari Dasha period.');
  }

  const dashaLordStartIndex = DASHA_KEYS.indexOf(currentDasha.key);
  let bhuktiStart = currentDasha.start;
  let currentBhukti = null;

  for (let offset = 0; offset < 9; offset += 1) {
    const bhuktiKey = DASHA_KEYS[(dashaLordStartIndex + offset) % 9];
    const durationYears =
      (DASHA_YEARS[currentDasha.key] * DASHA_YEARS[bhuktiKey]) / 120;
    const bhuktiEnd = new Date(bhuktiStart.getTime() + yearsToMs(durationYears));
    if (currentDate >= bhuktiStart && currentDate < bhuktiEnd) {
      currentBhukti = { key: bhuktiKey, start: bhuktiStart, end: bhuktiEnd };
      break;
    }
    bhuktiStart = bhuktiEnd;
  }

  if (!currentBhukti) {
    // Floating-point accumulation can put the final millisecond outside the loop.
    const finalKey = DASHA_KEYS[(dashaLordStartIndex + 8) % 9];
    currentBhukti = {
      key: finalKey,
      start: bhuktiStart,
      end: currentDasha.end,
    };
  }

  return {
    birthDasha: {
      key: birthState.lordKey,
      name: PLANET_NAMES[language][birthState.lordKey],
      balance: dasha?.birthBalance || null,
    },
    currentDasha: {
      key: currentDasha.key,
      name: PLANET_NAMES[language][currentDasha.key],
      startDate: formatLocalDate(currentDasha.start),
      endDate: formatLocalDate(currentDasha.end),
      startIsoUtc: currentDasha.start.toISOString(),
      endIsoUtc: currentDasha.end.toISOString(),
    },
    currentBhukti: {
      key: currentBhukti.key,
      name: PLANET_NAMES[language][currentBhukti.key],
      startDate: formatLocalDate(currentBhukti.start),
      endDate: formatLocalDate(currentBhukti.end),
      startIsoUtc: currentBhukti.start.toISOString(),
      endIsoUtc: currentBhukti.end.toISOString(),
    },
    calculationMethod: 'vimshottari-365.25-day-year-timeline',
  };
}

function buildBirthCalculationDetails({
  birthDate,
  latitude,
  longitude,
  ayanamsa,
  lagna,
  planets,
  dasha,
  language = 'ta',
  currentDate = new Date(),
}) {
  if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
    throw new Error('A valid birthDate is required for birth calculation details.');
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Valid latitude/longitude are required for birth calculation details.');
  }
  if (!['ta', 'en'].includes(language)) {
    throw new Error('language must be either ta or en.');
  }

  const moon = planets.find((planet) => planet.key === 'moon');
  if (!moon) throw new Error('Moon is required for birth calculation details.');

  const { sunrise, sunset } = getGoverningSunriseSunset(
    birthDate,
    latitude,
    longitude
  );
  // Traditional printed Panchangam values use the sunrise time at minute
  // precision. Use that same rounded minute for Udayadhi Nazhigai so the
  // calculation matches the displayed sunrise (for example 05:57 -> 25.20).
  const sunriseForNazhigai = roundDateToMinute(sunrise);
  const udayadhiSeconds =
    (birthDate.getTime() - sunriseForNazhigai.getTime()) / 1000;
  const ayanamsaDms = formatDms(ayanamsa);

  return {
    calculationMethod: 'thirukanitha-lahiri-additive-v1',
    timeZone: {
      name: 'Asia/Kolkata',
      utcOffset: '+05:30',
      commonTime: '5.30',
      timeCorrection: '0.00',
      timeCorrectionMethod: 'India-IST-no-daylight-saving-correction',
    },
    sunrise: {
      isoUtc: sunrise.toISOString(),
      dateIst: formatLocalDate(sunrise),
      timeIst: formatLocalTime(sunrise),
      timeIstWithSeconds: formatLocalTime(sunrise, true),
    },
    sunset: {
      isoUtc: sunset.toISOString(),
      dateIst: formatLocalDate(sunset),
      timeIst: formatLocalTime(sunset),
      timeIstWithSeconds: formatLocalTime(sunset, true),
    },
    ayanamsa: {
      decimalDegrees: ayanamsa,
      dms: ayanamsaDms,
      method: 'Lahiri',
    },
    udayadhiNazhigai: {
      ...formatNazhigaiFromSeconds(udayadhiSeconds),
      elapsedSecondsFromSunrise: udayadhiSeconds,
      calculationMethod: 'elapsed-time-from-governing-sunrise-1-nazhigai-24-minutes',
    },
    aadiAnthamNazhigai: getNakshatraDuration(
      birthDate,
      latitude,
      longitude,
      moon
    ),
    planetaryTable: buildPlanetaryTable({ lagna, planets, language }),
    dashaTimeline: buildDashaTimeline({
      birthDate,
      moon,
      dasha,
      language,
      currentDate,
    }),
  };
}

module.exports = {
  buildBirthCalculationDetails,
  formatDms,
  formatNazhigaiFromSeconds,
  buildPlanetaryTable,
};
