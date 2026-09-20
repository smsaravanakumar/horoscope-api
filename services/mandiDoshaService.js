/**
 * Client-specific Mandi Dosha rules.
 *
 * IMPORTANT:
 * - ADDITIVE ONLY. This service does not alter Mandi calculation, planets,
 *   charts, doshas, yogas, dasha, Nadi rules, Pitru Dosha, or Kala Sarpa.
 * - The rule is evaluated from Lagna using the already-calculated Mandi Rasi.
 * - Client rule: Mandi in houses 3, 6, or 11 => no Mandi Dosha.
 *   Mandi in houses 1, 2, 4, 5, 7, 8, 9, 10, or 12 => Mandi Dosha present.
 */

const EXEMPT_HOUSES = [3, 6, 11];

const HOUSE_EFFECTS = {
  1: {
    ta: "மந்தமான உடல்நிலை, குறுகிய ஆயுள், அடங்காத கோபம், தேவையற்ற அலைச்சல் மற்றும் உடல் சார்ந்த குறைபாடுகள்.",
    en: "Weak health, reduced longevity, uncontrolled anger, unnecessary wandering, and physical ailments.",
  },
  2: {
    ta: "தன சேதம், வாக்கு தோஷம் (கடுஞ்சொல் பேசுதல்), குடும்பத்தில் அமைதியின்மை, தவறான உணவுப் பழக்கம் மற்றும் கண் நோய்கள்.",
    en: "Financial loss, speech-related affliction (harsh speech), lack of peace in the family, unhealthy food habits, and eye problems.",
  },
  4: {
    ta: "தாய் வழி உறவுகளுடன் விரிசல், மன அமைதியின்மை, சுகவீனம், நிலம் மற்றும் வாகனங்களால் விரயங்கள்.",
    en: "Strained maternal-side relationships, lack of mental peace, ill health, and expenses or losses related to land and vehicles.",
  },
  5: {
    ta: "புத்திர தோஷம் (குழந்தைப் பேறின்மை அல்லது தாமதம்), பிள்ளைகளால் மனக்கவலை, புத்தி தடுமாற்றம் மற்றும் பூர்வ புண்ணியக் குறைபாடு.",
    en: "Progeny-related affliction (absence or delay of childbirth), worries through children, confusion in judgment, and reduced past-life merit.",
  },
  7: {
    ta: "களத்திர தோஷம், திருமணத் தடை, வாழ்க்கைத் துணையுடன் தொடர் சண்டை சச்சரவுகள் மற்றும் சீரற்ற தாம்பத்தியம்.",
    en: "Marital affliction, obstacles or delay in marriage, repeated conflicts with the spouse, and disturbed married life.",
  },
  8: {
    ta: "ஆயுள் பலம் குறைதல், திடீர் விபத்துக்கள், நச்சுப் பொருட்களால் பயம் மற்றும் முக/கண் சார்ந்த பிணிகள்.",
    en: "Reduced longevity strength, sudden accidents, fear from poisonous substances, and ailments related to the face or eyes.",
  },
  9: {
    ta: "தந்தை வழிப் பாதகங்கள், பாக்கியக் குறைவு, அதிர்ஷ்டமின்மை மற்றும் ஆன்மீகத்தில் போலித்தன்மை.",
    en: "Adverse effects through the paternal line, reduced fortune, lack of luck, and insincerity in spiritual matters.",
  },
  10: {
    ta: "தொழிலில் நிலையற்ற தன்மை, சமூகத்தில் பெயர் புகழுக்குக் களங்கம் மற்றும் தீய வழிகளில் ஈடுபாடு (சில வேளைகளில் தொழில் யோகம் தந்தாலும் தடைகள் தொடரும்).",
    en: "Instability in profession, damage to social reputation, and involvement in improper paths; even when career opportunities arise, obstacles may continue.",
  },
  12: {
    ta: "அதிக விரயம், நித்திரை பங்கம் (தூக்கமின்மை), கட்டில் சுகமின்மை மற்றும் வீண் அலைச்சல்கள்.",
    en: "Excess expenditure, disturbed sleep or insomnia, lack of bed comforts, and unnecessary wandering.",
  },
};

const REMEDY_TEMPLES = {
  ta: ["திருநாரையூர் கோயில்", "திருவல்லங்காடு கோயில்"],
  en: ["Thirunaraiyur Temple", "Thiruvallangadu Temple"],
};

const REMEDY = {
  ta: "பிரேதம் அடக்கம் செய்ய உதவி செய்ய வேண்டும்",
  en: "Help with the burial or final rites of an unclaimed/deceased person.",
};

const STATUS = {
  present: {
    ta: "மாந்தி தோஷம் உள்ளது",
    en: "Mandi Dosha is present",
  },
  absent: {
    ta: "மாந்தி தோஷம் இல்லை",
    en: "Mandi Dosha is not present",
  },
};

function normalizeRasi(rasiNo) {
  if (rasiNo === null || rasiNo === undefined || String(rasiNo).trim() === "") {
    return null;
  }
  const value = Number(rasiNo);
  if (!Number.isFinite(value)) return null;
  return ((Math.trunc(value) - 1 + 12) % 12) + 1;
}

function houseFromLagna(lagnaRasiNo, planetRasiNo) {
  const lagna = normalizeRasi(lagnaRasiNo);
  const planet = normalizeRasi(planetRasiNo);
  if (!lagna || !planet) return null;
  return ((planet - lagna + 12) % 12) + 1;
}

function localize(value, language) {
  if (!value) return null;
  return value[language] || value.ta || value.en || null;
}

function buildMandiDosha({ lagna, planets, language = "ta" } = {}) {
  const mandi = Array.isArray(planets)
    ? planets.find((planet) => planet && planet.key === "mandi") || null
    : null;

  const lagnaRasiNo = normalizeRasi(lagna?.rasiNo);
  const mandiRasiNo = normalizeRasi(mandi?.rasiNo);
  const house = houseFromLagna(lagnaRasiNo, mandiRasiNo);

  // Defensive output if upstream Mandi/Lagna is unavailable. This does not
  // reinterpret the rule; it simply avoids returning a false positive.
  if (!house) {
    return {
      evaluated: false,
      result: false,
      status: localize(STATUS.absent, language),
      house: null,
      mandiRasiNo,
      problem: null,
      remedyTemples: [],
      remedy: null,
      exemptHouses: [...EXEMPT_HOUSES],
      reason:
        language === "en"
          ? "Mandi Dosha could not be evaluated because Lagna or Mandi position is unavailable."
          : "லக்னம் அல்லது மாந்தி நிலை கிடைக்காததால் மாந்தி தோஷத்தை மதிப்பிட முடியவில்லை.",
    };
  }

  const result = !EXEMPT_HOUSES.includes(house);
  const effect = HOUSE_EFFECTS[house] || null;

  return {
    evaluated: true,
    result,
    status: localize(result ? STATUS.present : STATUS.absent, language),
    house,
    mandiRasiNo,
    problem: result ? localize(effect, language) : null,
    remedyTemples: result ? [...(REMEDY_TEMPLES[language] || REMEDY_TEMPLES.ta)] : [],
    remedy: result ? localize(REMEDY, language) : null,
    exemptHouses: [...EXEMPT_HOUSES],
    reason: result
      ? language === "en"
        ? `Mandi is placed in the ${house}${house === 1 ? "st" : house === 2 ? "nd" : house === 3 ? "rd" : "th"} house from Lagna. Under the client rule, Mandi Dosha is present outside houses 3, 6, and 11.`
        : `லக்னத்திலிருந்து மாந்தி ${house}-ஆம் பாவத்தில் உள்ளது. 3, 6, 11 பாவங்களைத் தவிர்ந்ததால் மாந்தி தோஷம் உள்ளது.`
      : language === "en"
        ? `Mandi is placed in the ${house}${house === 3 ? "rd" : "th"} house from Lagna, which is exempt under the client rule.`
        : `லக்னத்திலிருந்து மாந்தி ${house}-ஆம் பாவத்தில் உள்ளது. இது விதிவிலக்கான 3, 6, 11 பாவங்களில் ஒன்றாக இருப்பதால் மாந்தி தோஷம் இல்லை.`,
  };
}

module.exports = {
  buildMandiDosha,
  houseFromLagna,
  EXEMPT_HOUSES,
  HOUSE_EFFECTS,
};
