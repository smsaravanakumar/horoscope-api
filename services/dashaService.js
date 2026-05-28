const DASHA_SEQUENCE = {
  ta: [
    "கேது",
    "சுக்கிரன்",
    "சூரியன்",
    "சந்திரன்",
    "செவ்வாய்",
    "ராகு",
    "குரு",
    "சனி",
    "புதன்",
  ],
  en: [
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury",
  ],
};

const DASHA_YEARS = {
  ta: {
    "கேது": 7,
    "சுக்கிரன்": 20,
    "சூரியன்": 6,
    "சந்திரன்": 10,
    "செவ்வாய்": 7,
    "ராகு": 18,
    "குரு": 16,
    "சனி": 19,
    "புதன்": 17,
  },
  en: {
    Ketu: 7,
    Venus: 20,
    Sun: 6,
    Moon: 10,
    Mars: 7,
    Rahu: 18,
    Jupiter: 16,
    Saturn: 19,
    Mercury: 17,
  },
};

function getNakshatraIndex(longitude) {
  return Math.floor(longitude / (360 / 27));
}

function getBirthDasha(moonLongitude, language = "ta") {
  const sequence = DASHA_SEQUENCE[language];
  const yearsMap = DASHA_YEARS[language];

  const nakshatraSize = 360 / 27;
  const nakshatraIndex = getNakshatraIndex(moonLongitude);

  const lordIndex = nakshatraIndex % 9;
  const lord = sequence[lordIndex];

  const nakStart = nakshatraIndex * nakshatraSize;
  const progressed = moonLongitude - nakStart;
  const balanceRatio = 1 - progressed / nakshatraSize;

  const totalYears = yearsMap[lord];
  const balanceYearsDecimal = totalYears * balanceRatio;

  const years = Math.floor(balanceYearsDecimal);
  const monthsDecimal = (balanceYearsDecimal - years) * 12;
  const months = Math.floor(monthsDecimal);
  const days = Math.floor((monthsDecimal - months) * 30);

  return {
    lord,
    balanceYears: years,
    balanceMonths: months,
    balanceDays: days,
    balanceText:
      language === "ta"
        ? `${lord} திசை இருப்பு ${years} வருடம் ${months} மாதம் ${days} நாள்`
        : `${lord} Dasha balance ${years} years ${months} months ${days} days`,
    nakshatraIndex,
    lordIndex,
    balanceYearsDecimal,
  };
}

function getCurrentDashaBhukti({
  moonLongitude,
  birthDate,
  currentDate = new Date(),
  language = "ta",
}) {
  const sequence = DASHA_SEQUENCE[language];
  const yearsMap = DASHA_YEARS[language];

  const birthDasha = getBirthDasha(moonLongitude, language);

  const ageDays = (currentDate.getTime() - birthDate.getTime()) / 86400000;
  let ageYears = ageDays / 365.25;

  let currentLordIndex = birthDasha.lordIndex;

  if (ageYears <= birthDasha.balanceYearsDecimal) {
    return {
      dasha: birthDasha.lord,
      bhukti: getBhuktiLord(
        birthDasha.lord,
        ageYears,
        yearsMap[birthDasha.lord],
        language
      ),
      text:
        language === "ta"
          ? `${birthDasha.lord} திசை`
          : `${birthDasha.lord} Dasha`,
    };
  }

  ageYears -= birthDasha.balanceYearsDecimal;
  currentLordIndex = (currentLordIndex + 1) % 9;

  while (ageYears > yearsMap[sequence[currentLordIndex]]) {
    ageYears -= yearsMap[sequence[currentLordIndex]];
    currentLordIndex = (currentLordIndex + 1) % 9;
  }

  const currentDashaLord = sequence[currentLordIndex];

  const bhuktiLord = getBhuktiLord(
    currentDashaLord,
    ageYears,
    yearsMap[currentDashaLord],
    language
  );

  return {
    dasha: currentDashaLord,
    bhukti: bhuktiLord,
    text:
      language === "ta"
        ? `${currentDashaLord} திசை / ${bhuktiLord} புத்தி`
        : `${currentDashaLord} Dasha / ${bhuktiLord} Bhukti`,
  };
}

function getBhuktiLord(dashaLord, elapsedYearsInDasha, dashaYears, language) {
  const sequence = DASHA_SEQUENCE[language];
  const yearsMap = DASHA_YEARS[language];

  const startIndex = sequence.indexOf(dashaLord);
  let remaining = elapsedYearsInDasha;

  for (let i = 0; i < 9; i++) {
    const lord = sequence[(startIndex + i) % 9];
    const bhuktiDuration = (dashaYears * yearsMap[lord]) / 120;

    if (remaining <= bhuktiDuration) {
      return lord;
    }

    remaining -= bhuktiDuration;
  }

  return sequence[startIndex];
}

function calculateDasha({
  moonLongitude,
  birthDate,
  currentDate = new Date(),
  language = "ta",
}) {
  const birth = getBirthDasha(moonLongitude, language);

  const current = getCurrentDashaBhukti({
    moonLongitude,
    birthDate,
    currentDate,
    language,
  });

  return {
    birthDasha: birth.lord,
    birthBalance: {
      years: birth.balanceYears,
      months: birth.balanceMonths,
      days: birth.balanceDays,
      text: birth.balanceText,
    },
    currentDasha: current.dasha,
    currentBhukti: current.bhukti,
    currentText: current.text,
  };
}

module.exports = {
  calculateDasha,
};