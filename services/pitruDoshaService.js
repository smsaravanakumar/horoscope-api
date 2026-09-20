/**
 * Client-specific Pitru Dosha / Ancestor Dosha rules.
 *
 * IMPORTANT:
 * - ADDITIVE ONLY. This service must not modify any existing horoscope,
 *   planet, dasha, dosha, yoga, chart, or remedy calculation.
 * - The rules below are implemented from the client-supplied specification.
 * - Rule 8 is a cancellation rule: Jupiter's full 5/7/9 aspect to the Sun
 *   or the 9th house cancels the final Pitru Dosha result.
 */

const PLANET_LORD_BY_RASI = {
  1: "mars",
  2: "venus",
  3: "mercury",
  4: "moon",
  5: "sun",
  6: "mercury",
  7: "venus",
  8: "mars",
  9: "jupiter",
  10: "saturn",
  11: "saturn",
  12: "jupiter",
};

const RASI_NAMES = {
  1: { ta: "மேஷம்", en: "Aries" },
  2: { ta: "ரிஷபம்", en: "Taurus" },
  3: { ta: "மிதுனம்", en: "Gemini" },
  4: { ta: "கடகம்", en: "Cancer" },
  5: { ta: "சிம்மம்", en: "Leo" },
  6: { ta: "கன்னி", en: "Virgo" },
  7: { ta: "துலாம்", en: "Libra" },
  8: { ta: "விருச்சிகம்", en: "Scorpio" },
  9: { ta: "தனுசு", en: "Sagittarius" },
  10: { ta: "மகரம்", en: "Capricorn" },
  11: { ta: "கும்பம்", en: "Aquarius" },
  12: { ta: "மீனம்", en: "Pisces" },
};

const PITRU_TEMPLE = {
  ta: "பரசுராமர் ஆலயம், திருவல்லம், திருவனந்தபுரம்",
  en: "Parasuramar Temple, Thiruvallam, Thiruvananthapuram",
};

const PITRU_TITHI = {
  ta: "அமாவாசை",
  en: "Amavasya",
};

const STATUS_TEXT = {
  present: {
    ta: "முன்னோர் தோஷம் (பித்ரு தோஷம்) உள்ளது",
    en: "Ancestor Dosha (Pitru Dosha) is present",
  },
  absent: {
    ta: "பித்ரு தோஷம் இல்லை",
    en: "Pitru Dosha is not present",
  },
};

const SEVERITY_TEXT = {
  mild: { ta: "லேசானது", en: "Mild" },
  moderate: { ta: "மிதமானது", en: "Moderate" },
  severe: { ta: "தீவிரமானது", en: "Severe" },
};

function localize(value, language) {
  if (!value) return null;
  return value[language] || value.ta || value.en || null;
}

function getPlanet(planets, key) {
  return Array.isArray(planets)
    ? planets.find((planet) => planet.key === key) || null
    : null;
}

function normalizeRasi(rasiNo) {
  const value = Number(rasiNo);
  if (!Number.isFinite(value)) return null;
  return ((Math.trunc(value) - 1 + 12) % 12) + 1;
}

function houseRasi(lagnaRasiNo, houseNo) {
  return normalizeRasi(Number(lagnaRasiNo) + Number(houseNo) - 1);
}

function houseFromLagna(lagnaRasiNo, planetRasiNo) {
  const lagna = normalizeRasi(lagnaRasiNo);
  const planet = normalizeRasi(planetRasiNo);
  if (!lagna || !planet) return null;
  return ((planet - lagna + 12) % 12) + 1;
}

function sameRasi(...planets) {
  const valid = planets.filter(Boolean);
  return (
    valid.length === planets.length &&
    valid.length > 1 &&
    valid.every((planet) => planet.rasiNo === valid[0].rasiNo)
  );
}

function oppositeRasi(a, b) {
  if (!a || !b) return false;
  return normalizeRasi(Number(a.rasiNo) + 6) === Number(b.rasiNo);
}

function aspectHits(aspects, fromKey, toRasi, allowedAspects = null) {
  return (Array.isArray(aspects) ? aspects : []).some((aspect) => {
    if (aspect.fromKey !== fromKey || Number(aspect.toRasi) !== Number(toRasi)) {
      return false;
    }
    return !allowedAspects || allowedAspects.includes(Number(aspect.aspect));
  });
}

function isDebilitated(planet) {
  if (!planet) return false;
  const strength = String(planet.strength || "").trim().toLowerCase();
  return strength === "நீசம்" || strength === "debilitated";
}

/**
 * The client specification uses the generic term "பலவீனம்" (weakness)
 * without defining a complete strength-scoring model. The current API already
 * exposes debilitation and combustion, so this isolated rule engine uses only
 * those two explicit existing indicators. This keeps the new logic additive
 * and avoids inventing a new planetary-strength system.
 */
function isWeak(planet) {
  return Boolean(planet && (isDebilitated(planet) || planet.combust === true));
}

function conjunctionWithinDegrees(a, b, maxDegrees) {
  if (!a || !b) return false;
  const aLongitude = Number(a.longitude);
  const bLongitude = Number(b.longitude);
  if (!Number.isFinite(aLongitude) || !Number.isFinite(bLongitude)) return false;
  const raw = Math.abs(aLongitude - bLongitude) % 360;
  const distance = Math.min(raw, 360 - raw);
  return distance <= maxDegrees;
}

function buildRule({ id, titleTa, titleEn, reasonTa, reasonEn, details = {} }, language) {
  return {
    ruleId: id,
    ruleNo: id === "P0" ? 0 : Number(String(id).replace("P", "")),
    title: language === "ta" ? titleTa : titleEn,
    reason: language === "ta" ? reasonTa : reasonEn,
    details,
  };
}

/**
 * Current client-confirmed severity policy:
 *   1 matched Pitru rule  -> Mild
 *   2 matched Pitru rules -> Moderate
 *   more than 2           -> Severe
 *
 * Rule 8 is a cancellation rule and is therefore not counted as a dosha rule.
 */
function severityFromMatchCount(count) {
  if (count >= 3) return "severe";
  if (count === 2) return "moderate";
  if (count === 1) return "mild";
  return null;
}

function buildPitruDosha({ lagna, planets, aspects, language = "ta" }) {
  const safeLanguage = language === "en" ? "en" : "ta";
  const lagnaRasiNo = Number(lagna?.rasiNo);

  if (!Number.isFinite(lagnaRasiNo) || !Array.isArray(planets)) {
    return {
      result: false,
      status: localize(STATUS_TEXT.absent, safeLanguage),
      severityKey: null,
      severity: null,
      matchedRules: [],
      cancellation: { applied: false, ruleNo: 8, reason: null },
      remedy: null,
    };
  }

  const sun = getPlanet(planets, "sun");
  const moon = getPlanet(planets, "moon");
  const jupiter = getPlanet(planets, "jupiter");
  const saturn = getPlanet(planets, "saturn");
  const rahu = getPlanet(planets, "rahu");
  const ketu = getPlanet(planets, "ketu");
  const mandi = getPlanet(planets, "mandi");

  const fifthRasi = houseRasi(lagnaRasiNo, 5);
  const ninthRasi = houseRasi(lagnaRasiNo, 9);
  const fourthRasi = houseRasi(lagnaRasiNo, 4);

  const fifthLordKey = PLANET_LORD_BY_RASI[fifthRasi];
  const ninthLordKey = PLANET_LORD_BY_RASI[ninthRasi];
  const fourthLordKey = PLANET_LORD_BY_RASI[fourthRasi];

  const fifthLord = getPlanet(planets, fifthLordKey);
  const ninthLord = getPlanet(planets, ninthLordKey);
  const fourthLord = getPlanet(planets, fourthLordKey);

  const matchedRules = [];

  // Client pre-rule: Rahu or Ketu in the 5th house from Lagna.
  const nodeInFifth = [rahu, ketu].filter(
    (planet) => planet && houseFromLagna(lagnaRasiNo, planet.rasiNo) === 5
  );
  if (nodeInFifth.length > 0) {
    matchedRules.push(
      buildRule(
        {
          id: "P0",
          titleTa: "லக்னத்திற்கு 5-ஆம் இடத்தில் ராகு / கேது",
          titleEn: "Rahu / Ketu in the 5th house from Lagna",
          reasonTa: `லக்னத்திற்கு 5-ஆம் இடத்தில் ${nodeInFifth.map((p) => p.name).join(" / ")} இருப்பதால் பித்ரு தோஷ விதி பொருந்துகிறது.`,
          reasonEn: `${nodeInFifth.map((p) => p.name).join(" / ")} is placed in the 5th house from Lagna.`,
          details: {
            house: 5,
            planets: nodeInFifth.map((p) => p.key),
            rasiNo: fifthRasi,
            rasi: localize(RASI_NAMES[fifthRasi], safeLanguage),
          },
        },
        safeLanguage
      )
    );
  }

  // Rule 1: Sun with Rahu/Ketu in the same sign, or on the 1/7 axis.
  const sunNodeLinks = [rahu, ketu].filter(
    (node) => sameRasi(sun, node) || oppositeRasi(sun, node)
  );
  if (sun && sunNodeLinks.length > 0) {
    matchedRules.push(
      buildRule(
        {
          id: "P1",
          titleTa: "சூரியன் – ராகு / கேது தொடர்பு",
          titleEn: "Sun – Rahu / Ketu association",
          reasonTa: `சூரியன் ${sunNodeLinks.map((p) => p.name).join(" / ")} உடன் சேர்க்கை அல்லது 1/7 அச்சுத் தொடர்பில் இருப்பதால் பித்ரு தோஷ விதி பொருந்துகிறது.`,
          reasonEn: `The Sun is conjunct or on the 1/7 axis with ${sunNodeLinks.map((p) => p.name).join(" / ")}.`,
          details: {
            sunRasiNo: sun.rasiNo,
            nodeKeys: sunNodeLinks.map((p) => p.key),
          },
        },
        safeLanguage
      )
    );
  }

  // Rule 2: 9th lord conjunct Rahu or Ketu.
  const ninthLordNodeLinks = [rahu, ketu].filter((node) => sameRasi(ninthLord, node));
  if (ninthLord && ninthLordNodeLinks.length > 0) {
    matchedRules.push(
      buildRule(
        {
          id: "P2",
          titleTa: "9-ஆம் அதிபதி – ராகு / கேது தொடர்பு",
          titleEn: "9th lord – Rahu / Ketu association",
          reasonTa: `9-ஆம் அதிபதியான ${ninthLord.name} ${ninthLordNodeLinks.map((p) => p.name).join(" / ")} உடன் இணைந்து இருப்பதால் பித்ரு தோஷ விதி பொருந்துகிறது.`,
          reasonEn: `The 9th lord ${ninthLord.name} is conjunct ${ninthLordNodeLinks.map((p) => p.name).join(" / ")}.`,
          details: {
            ninthHouseRasiNo: ninthRasi,
            ninthLordKey,
            ninthLordHouse: houseFromLagna(lagnaRasiNo, ninthLord.rasiNo),
            ninthLordDebilitated: isDebilitated(ninthLord),
            ninthLordCombust: Boolean(ninthLord.combust),
            nodeKeys: ninthLordNodeLinks.map((p) => p.key),
          },
        },
        safeLanguage
      )
    );
  }

  // Rule 3: Client-confirmed clarification.
  // Rahu OR Ketu in the 9th house is sufficient by itself for Pitru Dosha.
  // The 9th lord does NOT need to be weak for Rahu/Ketu detection.
  // Preserve the original Saturn branch: Saturn in the 9th house requires a weak 9th lord.
  const ninthHouseNodes = [rahu, ketu].filter(
    (planet) => planet && Number(planet.rasiNo) === Number(ninthRasi)
  );
  const saturnInNinth = saturn && Number(saturn.rasiNo) === Number(ninthRasi);
  const ninthLordWeak = isWeak(ninthLord);
  const rule3Matched = ninthHouseNodes.length > 0 || (saturnInNinth && ninthLordWeak);

  if (rule3Matched) {
    const nodeReasonTa = ninthHouseNodes.length > 0
      ? `9-ஆம் பாவத்தில் ${ninthHouseNodes.map((p) => p.name).join(" / ")} இருப்பதால் பித்ரு தோஷ விதி பொருந்துகிறது.`
      : null;
    const nodeReasonEn = ninthHouseNodes.length > 0
      ? `${ninthHouseNodes.map((p) => p.name).join(" / ")} occupies the 9th house, so the Pitru Dosha rule applies.`
      : null;
    const saturnReasonTa = saturnInNinth && ninthLordWeak
      ? "9-ஆம் பாவத்தில் சனி இருப்பதுடன் 9-ஆம் அதிபதி பலவீனமாக இருப்பதால் பித்ரு தோஷ விதி பொருந்துகிறது."
      : null;
    const saturnReasonEn = saturnInNinth && ninthLordWeak
      ? "Saturn occupies the 9th house while the 9th lord is weak, so the Pitru Dosha rule applies."
      : null;

    matchedRules.push(
      buildRule(
        {
          id: "P3",
          titleTa: "9-ஆம் பாவத்தில் ராகு / கேது / சனி ஆதிக்கம்",
          titleEn: "Rahu / Ketu / Saturn influence in the 9th house",
          reasonTa: [nodeReasonTa, saturnReasonTa].filter(Boolean).join(" "),
          reasonEn: [nodeReasonEn, saturnReasonEn].filter(Boolean).join(" "),
          details: {
            ninthHouseRasiNo: ninthRasi,
            nodeKeys: ninthHouseNodes.map((p) => p.key),
            saturnInNinth: Boolean(saturnInNinth),
            ninthLordKey,
            ninthLordWeak,
            ninthLordDebilitated: isDebilitated(ninthLord),
            ninthLordCombust: Boolean(ninthLord?.combust),
          },
        },
        safeLanguage
      )
    );
  }

  // Rule 4: Client's Pitru Shaapa Putra Dosha combinations, with weak Jupiter.
  const sunInFifth = sun && Number(sun.rasiNo) === Number(fifthRasi);
  const sunWithRahuOrSaturn = sunInFifth && (sameRasi(sun, rahu) || sameRasi(sun, saturn));
  const fifthNinthLordsWithRahu =
    fifthLord && ninthLord && rahu &&
    sameRasi(fifthLord, ninthLord) && sameRasi(fifthLord, rahu);
  if ((sunWithRahuOrSaturn || fifthNinthLordsWithRahu) && isWeak(jupiter)) {
    matchedRules.push(
      buildRule(
        {
          id: "P4",
          titleTa: "பித்ரு சாப புத்திர தோஷ அமைப்பு",
          titleEn: "Pitru Shaapa Putra Dosha combination",
          reasonTa: "5-ஆம் பாவம் / 5-ஆம் மற்றும் 9-ஆம் அதிபதி தொடர்பான பித்ரு சாப அமைப்புடன் குரு பலவீனமாக இருப்பதால் இந்த விதி பொருந்துகிறது.",
          reasonEn: "A specified 5th-house / 5th-and-9th-lord Pitru Shaapa combination is present together with a weak Jupiter.",
          details: {
            sunInFifthWithRahuOrSaturn: Boolean(sunWithRahuOrSaturn),
            fifthAndNinthLordsWithRahu: Boolean(fifthNinthLordsWithRahu),
            jupiterDebilitated: isDebilitated(jupiter),
            jupiterCombust: Boolean(jupiter?.combust),
          },
        },
        safeLanguage
      )
    );
  }

  // Rule 5: Sun-Mandi close conjunction, or Sun-Saturn conjunction with Mandi influence.
  // The client text says "நெருங்கிய பாகை" but does not state a numeric orb.
  // We use a conservative <= 5° conjunction threshold, matching the client's
  // separate Nadi-rule convention for close conjunctions. Kept isolated here so
  // the threshold can be changed without touching any locked calculation.
  const sunMandiClose = sameRasi(sun, mandi) && conjunctionWithinDegrees(sun, mandi, 5);
  const sunSaturnConjunction = sameRasi(sun, saturn);
  const mandiInfluencesSunSaturn =
    mandi && sunSaturnConjunction &&
    (sameRasi(mandi, sun) || oppositeRasi(mandi, sun));
  if (sunMandiClose || mandiInfluencesSunSaturn) {
    matchedRules.push(
      buildRule(
        {
          id: "P5",
          titleTa: "சூரியன் – சனி – மாந்தி தொடர்பு",
          titleEn: "Sun – Saturn – Mandi association",
          reasonTa: sunMandiClose
            ? "சூரியனும் மாந்தியும் ஒரே ராசியில் 5° பாகைக்குள் நெருங்கிய சேர்க்கையில் உள்ளதால் இந்த பித்ரு தோஷ விதி பொருந்துகிறது."
            : "சூரியன்–சனி சேர்க்கைக்கு மாந்தி தொடர்பு இருப்பதால் இந்த பித்ரு தோஷ விதி பொருந்துகிறது.",
          reasonEn: sunMandiClose
            ? "The Sun and Mandi are closely conjunct within 5° in the same sign."
            : "The Sun-Saturn conjunction receives Mandi association on the same/1-7 axis.",
          details: {
            sunMandiWithin5Degrees: Boolean(sunMandiClose),
            sunSaturnWithMandiInfluence: Boolean(mandiInfluencesSunSaturn),
          },
        },
        safeLanguage
      )
    );
  }

  // Rule 6: Sun debilitated in Libra, influenced by Saturn, and weak 9th lord.
  const sunInLibraDebilitated = sun && Number(sun.rasiNo) === 7 && isDebilitated(sun);
  const saturnInfluencesSun = sun && saturn &&
    (sameRasi(saturn, sun) || aspectHits(aspects, "saturn", sun.rasiNo, [3, 7, 10]));
  if (sunInLibraDebilitated && saturnInfluencesSun && isWeak(ninthLord)) {
    matchedRules.push(
      buildRule(
        {
          id: "P6",
          titleTa: "சூரியன் நீசம் மற்றும் சனி பாபத் தொடர்பு",
          titleEn: "Debilitated Sun with Saturn influence",
          reasonTa: "சூரியன் துலாம் ராசியில் நீசம் பெற்று சனியின் சேர்க்கை/பார்வை பெறுவதுடன் 9-ஆம் அதிபதியும் பலவீனமாக இருப்பதால் இந்த விதி பொருந்துகிறது.",
          reasonEn: "The Sun is debilitated in Libra under Saturn influence, while the 9th lord is also weak.",
          details: {
            sunRasiNo: sun?.rasiNo || null,
            saturnInfluence: Boolean(saturnInfluencesSun),
            ninthLordKey,
            ninthLordDebilitated: isDebilitated(ninthLord),
            ninthLordCombust: Boolean(ninthLord?.combust),
          },
        },
        safeLanguage
      )
    );
  }

  // Rule 7: Maternal-line Pitru Dosha.
  const moonWithNode = [rahu, ketu].filter((node) => sameRasi(moon, node));
  const nodeInFourth = [rahu, ketu].filter(
    (node) => node && Number(node.rasiNo) === Number(fourthRasi)
  );
  const fourthLordHouse = fourthLord
    ? houseFromLagna(lagnaRasiNo, fourthLord.rasiNo)
    : null;
  const fourthHousePattern =
    nodeInFourth.length > 0 && [8, 12].includes(Number(fourthLordHouse));
  if (moonWithNode.length > 0 || fourthHousePattern) {
    matchedRules.push(
      buildRule(
        {
          id: "P7",
          titleTa: "மாத்ரு / தாய்வழி பித்ரு தோஷ அமைப்பு",
          titleEn: "Maternal-line Pitru Dosha combination",
          reasonTa: moonWithNode.length > 0
            ? `சந்திரன் ${moonWithNode.map((p) => p.name).join(" / ")} உடன் இணைந்து இருப்பதால் தாய்வழி பித்ரு தோஷ விதி பொருந்துகிறது.`
            : "4-ஆம் பாவத்தில் ராகு/கேது இருந்து 4-ஆம் அதிபதி 8 அல்லது 12-ஆம் பாவத்தில் இருப்பதால் தாய்வழி பித்ரு தோஷ விதி பொருந்துகிறது.",
          reasonEn: moonWithNode.length > 0
            ? `The Moon is conjunct ${moonWithNode.map((p) => p.name).join(" / ")}.`
            : "Rahu/Ketu occupies the 4th house and the 4th lord is placed in the 8th or 12th house.",
          details: {
            moonNodeKeys: moonWithNode.map((p) => p.key),
            fourthHouseNodeKeys: nodeInFourth.map((p) => p.key),
            fourthLordKey,
            fourthLordHouse,
          },
        },
        safeLanguage
      )
    );
  }

  // Rule 8: Jupiter's full benefic aspect to the Sun or the 9th house cancels Pitru Dosha.
  const jupiterAspectToSun =
    sun && aspectHits(aspects, "jupiter", sun.rasiNo, [5, 7, 9]);
  const jupiterAspectToNinthHouse = aspectHits(
    aspects,
    "jupiter",
    ninthRasi,
    [5, 7, 9]
  );
  const cancellationApplied =
    matchedRules.length > 0 && (jupiterAspectToSun || jupiterAspectToNinthHouse);

  const rawSeverityKey = severityFromMatchCount(matchedRules.length);
  const finalResult = matchedRules.length > 0 && !cancellationApplied;

  const cancellationReason = cancellationApplied
    ? safeLanguage === "ta"
      ? `சூத்திரம் 8 நிவர்த்தி விதி பொருந்துகிறது: குருவின் பூரண சுபப் பார்வை ${jupiterAspectToSun ? "சூரியன் மீது" : "9-ஆம் பாவத்தின் மீது"} விழுவதால் இறுதி முடிவில் பித்ரு தோஷம் இல்லை.`
      : `Rule 8 cancellation applies: Jupiter's full benefic aspect falls on ${jupiterAspectToSun ? "the Sun" : "the 9th house"}, so the final Pitru Dosha result is cancelled.`
    : null;

  return {
    result: finalResult,
    detectedBeforeCancellation: matchedRules.length > 0,
    status: localize(finalResult ? STATUS_TEXT.present : STATUS_TEXT.absent, safeLanguage),
    severityKey: finalResult ? rawSeverityKey : null,
    severity: finalResult && rawSeverityKey
      ? localize(SEVERITY_TEXT[rawSeverityKey], safeLanguage)
      : null,
    matchedRuleCount: matchedRules.length,
    matchedRules,
    cancellation: {
      applied: cancellationApplied,
      ruleNo: 8,
      jupiterAspectToSun: Boolean(jupiterAspectToSun),
      jupiterAspectToNinthHouse: Boolean(jupiterAspectToNinthHouse),
      reason: cancellationReason,
    },
    remedy: finalResult
      ? {
          tithi: localize(PITRU_TITHI, safeLanguage),
          temple: localize(PITRU_TEMPLE, safeLanguage),
          instruction:
            safeLanguage === "ta"
              ? "அமாவாசை திதியில் பரசுராமர் ஆலயம், திருவல்லம், திருவனந்தபுரம் வழிபாடு செய்ய வேண்டும்."
              : "On Amavasya, worship at Parasuramar Temple, Thiruvallam, Thiruvananthapuram.",
        }
      : null,
    evaluationContext: {
      lagnaRasiNo,
      fifthHouseRasiNo: fifthRasi,
      ninthHouseRasiNo: ninthRasi,
      fourthHouseRasiNo: fourthRasi,
      fifthLordKey,
      ninthLordKey,
      fourthLordKey,
    },
  };
}

module.exports = {
  buildPitruDosha,
};
