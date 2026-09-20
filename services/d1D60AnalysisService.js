// Client-specific D1-D60 analysis foundation.
// Additive only: does not modify any existing horoscope, Yoga, Nadi, Dosha,
// Dasha/Bhukti, chart or Pancha Pakshi calculations.
//
// Phase 2 extends the frozen D1 + D9 + D60 foundation with the client-confirmed
// Parashara D1-D60 workflow. To keep the extension isolated and auditable,
// D1-D60 transformed longitudes are produced by the locked extended-varga
// mapping used by this module only; existing birth-chart calculations are untouched.

const RASI_NAMES = {
  ta: ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"],
  en: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
};

const SIGN_LORD_KEY = {
  1: "mars", 2: "venus", 3: "mercury", 4: "moon", 5: "sun", 6: "mercury",
  7: "venus", 8: "mars", 9: "jupiter", 10: "saturn", 11: "saturn", 12: "jupiter",
};

const DEBILITATED_SIGNS = {
  sun: 7, moon: 8, mars: 4, mercury: 12, jupiter: 10, venus: 6, saturn: 1,
};

// Natural-enemy convention used only by this isolated client analysis.
const NATURAL_ENEMIES = {
  sun: new Set(["venus", "saturn"]),
  moon: new Set([]),
  mars: new Set(["mercury"]),
  mercury: new Set(["moon"]),
  jupiter: new Set(["mercury", "venus"]),
  venus: new Set(["sun", "moon"]),
  saturn: new Set(["sun", "moon"]),
  rahu: new Set([]),
  ketu: new Set([]),
};

// Keep the same primary-malefic convention already used in the locked client/Nadi work.
const PRIMARY_MALEFICS = new Set(["mars", "saturn", "rahu", "ketu"]);
const CLASSICAL_GRAHAS = new Set(["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"]);

const ASPECT_RULES = {
  sun: [7], moon: [7], mercury: [7], venus: [7], rahu: [7], ketu: [7],
  mars: [4, 7, 8], jupiter: [5, 7, 9], saturn: [3, 7, 10],
};


const NAKSHATRA_NAMES = {
  ta: [
    "அஸ்வினி","பரணி","கிருத்திகை","ரோகிணி","மிருகசீரிஷம்","திருவாதிரை","புனர்பூசம்","பூசம்","ஆயில்யம்",
    "மகம்","பூரம்","உத்திரம்","ஹஸ்தம்","சித்திரை","சுவாதி","விசாகம்","அனுஷம்","கேட்டை",
    "மூலம்","பூராடம்","உத்திராடம்","திருவோணம்","அவிட்டம்","சதயம்","பூரட்டாதி","உத்திரட்டாதி","ரேவதி"
  ],
  en: [
    "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha",
    "Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
    "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
  ],
};

function normalizeLongitude(value) {
  let x = Number(value) % 360;
  if (x < 0) x += 360;
  return x;
}

// Client-confirmed Parashara D1-D60 convention for this extended analysis layer.
// The transformed longitude is intentionally isolated from the natal chart engine.
function getExtendedVargaLongitude(longitude, division) {
  if (!Number.isInteger(division) || division < 1 || division > 60) {
    throw new Error(`Invalid varga division D${division}`);
  }
  return normalizeLongitude(normalizeLongitude(longitude) * division);
}

function longitudeDetails(longitude, language = "ta") {
  const value = normalizeLongitude(longitude);
  const rasiNo = Math.floor(value / 30) + 1;
  const nakSize = 360 / 27;
  const padaSize = nakSize / 4;
  const nakshatraNo = Math.min(27, Math.floor(value / nakSize) + 1);
  const withinNak = value - (nakshatraNo - 1) * nakSize;
  const pada = Math.min(4, Math.floor((withinNak + 1e-10) / padaSize) + 1);
  return {
    longitude: value,
    rasiNo,
    rasi: RASI_NAMES[language][rasiNo - 1],
    nakshatraNo,
    nakshatra: NAKSHATRA_NAMES[language][nakshatraNo - 1],
    pada,
  };
}

function buildNakshatraFrequency(divisionalCharts, language = "ta") {
  const counts = new Map();
  for (const chart of divisionalCharts) {
    const n = chart.lagna.nakshatraNo;
    if (!counts.has(n)) counts.set(n, {
      nakshatraNo:n,
      nakshatra:NAKSHATRA_NAMES[language][n-1],
      count:0,
      charts:[],
    });
    const item = counts.get(n);
    item.count += 1;
    item.charts.push(chart.chart);
  }
  const occurring = [...counts.values()];
  const topTwo = [...occurring].sort((a,b) => (b.count-a.count) || (a.nakshatraNo-b.nakshatraNo)).slice(0,2);
  const bottomTwo = [...occurring].sort((a,b) => (a.count-b.count) || (a.nakshatraNo-b.nakshatraNo)).slice(0,2);
  return {
    basis: "lagna_nakshatra_across_D1_to_D60",
    totalCharts: divisionalCharts.length,
    distinctNakshatrasOccurred: occurring.length,
    all: occurring.sort((a,b)=>a.nakshatraNo-b.nakshatraNo),
    topTwo,
    bottomTwo,
  };
}

const D60_ROWS = [
  [1,"Ghora","அசுபம்","inauspicious"],
  [2,"Rakshasa","அசுபம்","inauspicious"],
  [3,"Deva","சுபம்","auspicious"],
  [4,"Kubera","சுபம்","auspicious"],
  [5,"Yaksha","சுபம்","auspicious"],
  [6,"Kinnara","சுபம்","auspicious"],
  [7,"Bhrashta","அசுபம்","inauspicious"],
  [8,"Kulaghna","அசுபம்","inauspicious"],
  [9,"Garala","அசுபம்","inauspicious"],
  [10,"Vahni","அசுபம்","inauspicious"],
  [11,"Maya","சுப/அசுப கலப்பு","mixed"],
  [12,"Pureesha","அசுபம்","inauspicious"],
  [13,"Apampati","சுபம்","auspicious"],
  [14,"Maruta","சுபம்","auspicious"],
  [15,"Kaala","அசுபம்","inauspicious"],
  [16,"Sarpa","அசுபம்","inauspicious"],
  [17,"Amrita","மிக சுபம்","highly_auspicious"],
  [18,"Indu","சுபம்","auspicious"],
  [19,"Mridu","சுபம்","auspicious"],
  [20,"Komala","சுபம்","auspicious"],
  [21,"Heramba","சுபம்","auspicious"],
  [22,"Brahma","மிக சுபம்","highly_auspicious"],
  [23,"Vishnu","மிக சுபம்","highly_auspicious"],
  [24,"Maheshwara","சுபம்","auspicious"],
  [25,"Deva","சுபம்","auspicious"],
  [26,"Ardra","சுப/அசுப கலப்பு","mixed"],
  [27,"Kalinasa","சுபம்","auspicious"],
  [28,"Kshitija","சுபம்","auspicious"],
  [29,"Kamalakara","சுபம்","auspicious"],
  [30,"Mandatmaja","அசுபம்","inauspicious"],
  [31,"Mrityu","அசுபம்","inauspicious"],
  [32,"Kaala","அசுபம்","inauspicious"],
  [33,"Davagni","அசுபம்","inauspicious"],
  [34,"Ghora","அசுபம்","inauspicious"],
  [35,"Adhama","அசுபம்","inauspicious"],
  [36,"Kantaka","அசுபம்","inauspicious"],
  [37,"Sudha","மிக சுபம்","highly_auspicious"],
  [38,"Amrita","மிக சுபம்","highly_auspicious"],
  [39,"Poornachandra","மிக சுபம்","highly_auspicious"],
  [40,"Vishadagdha","அசுபம்","inauspicious"],
  [41,"Kulanasa","அசுபம்","inauspicious"],
  [42,"Vamsakshaya","அசுபம்","inauspicious"],
  [43,"Utpata","அசுபம்","inauspicious"],
  [44,"Kaalarupa","அசுபம்","inauspicious"],
  [45,"Saumya","சுபம்","auspicious"],
  [46,"Komala","சுபம்","auspicious"],
  [47,"Seethala","சுபம்","auspicious"],
  [48,"Damshtrakarala","அசுபம்","inauspicious"],
  [49,"Chandramukhi","சுபம்","auspicious"],
  [50,"Praveena","சுபம்","auspicious"],
  [51,"Kaalapavaka","அசுபம்","inauspicious"],
  [52,"Dandayudha","அசுபம்","inauspicious"],
  [53,"Nirmala","மிக சுபம்","highly_auspicious"],
  [54,"Saumya","சுபம்","auspicious"],
  [55,"Kroora","அசுபம்","inauspicious"],
  [56,"Atiseethala","சுபம்","auspicious"],
  [57,"Amrita","மிக சுபம்","highly_auspicious"],
  [58,"Payonidhi","சுபம்","auspicious"],
  [59,"Bhramana","சுப/அசுப கலப்பு","mixed"],
  [60,"Chandrarekha","மிக சுபம்","highly_auspicious"],
].map(([division, name, natureTa, natureCode]) => ({
  division,
  startDegree: (division - 1) * 0.5,
  endDegree: division * 0.5,
  name,
  natureTa,
  natureCode,
}));

function normalizeRasiNo(rasiNo) {
  return ((Number(rasiNo) - 1 + 12) % 12) + 1;
}

function houseFromRasi(lagnaRasi, planetRasi) {
  return ((planetRasi - lagnaRasi + 12) % 12) + 1;
}

function getNavamsaRasiNumber(longitude) {
  const signNo = Math.floor(longitude / 30) + 1;
  const degreeInSign = longitude % 30;
  const navamsaIndex = Math.floor(degreeInSign / (30 / 9));
  let startSign;
  if ([1,4,7,10].includes(signNo)) startSign = signNo;
  else if ([2,5,8,11].includes(signNo)) startSign = signNo + 8;
  else startSign = signNo + 4;
  return normalizeRasiNo(startSign + navamsaIndex);
}

function getD60Row(longitude) {
  const degreeInRasi = ((Number(longitude) % 30) + 30) % 30;
  const division = Math.min(60, Math.floor(degreeInRasi / 0.5) + 1);
  return D60_ROWS[division - 1];
}

function targetsRasi(fromRasi, aspectOffset) {
  return normalizeRasiNo(fromRasi + aspectOffset - 1);
}

function hasMaleficAspect(targetKey, targetRasi, placements) {
  return placements.some((source) => {
    if (source.key === targetKey || !PRIMARY_MALEFICS.has(source.key)) return false;
    const rules = ASPECT_RULES[source.key] || [7];
    return rules.some((offset) => targetsRasi(source.rasiNo, offset) === targetRasi);
  });
}

function evaluateChartAffliction({ planet, rasiNo, lagnaRasi, placements, includeCombust = false, language = "ta" }) {
  const reasons = [];
  const house = houseFromRasi(lagnaRasi, rasiNo);
  const signLord = SIGN_LORD_KEY[rasiNo];

  if (DEBILITATED_SIGNS[planet.key] === rasiNo) {
    reasons.push({ code: "debilitated", ta: "நீசம்", en: "Debilitated" });
  }
  if (NATURAL_ENEMIES[planet.key]?.has(signLord)) {
    reasons.push({ code: "enemy_sign", ta: "பகை வீடு", en: "Enemy sign" });
  }
  const maleficConjunctions = placements.filter(
    (other) => other.key !== planet.key && PRIMARY_MALEFICS.has(other.key) && other.rasiNo === rasiNo
  );
  if (maleficConjunctions.length) {
    reasons.push({
      code: "malefic_conjunction",
      ta: "பாவகிரக சேர்க்கை",
      en: "Malefic conjunction",
      with: maleficConjunctions.map((p) => p.key),
    });
  }
  if (hasMaleficAspect(planet.key, rasiNo, placements)) {
    reasons.push({ code: "malefic_aspect", ta: "பாவகிரக பார்வை", en: "Malefic aspect" });
  }
  if ([6,8,12].includes(house)) {
    reasons.push({ code: "dusthana_house", ta: `${house}-ஆம் பாவ நிலை`, en: `Placed in house ${house}`, house });
  }
  if (includeCombust && planet.combust === true) {
    reasons.push({ code: "combust", ta: "அஸ்தங்கம்", en: "Combust" });
  }

  return {
    affected: reasons.length > 0,
    rasiNo,
    rasi: RASI_NAMES[language][rasiNo - 1],
    house,
    reasons,
  };
}

function lordNameToKey(name) {
  const value = String(name || "").trim().toLowerCase();
  const aliases = {
    sun:["sun","சூரியன்"], moon:["moon","சந்திரன்"], mars:["mars","செவ்வாய்"],
    mercury:["mercury","புதன்"], jupiter:["jupiter","குரு"], venus:["venus","சுக்கிரன்"],
    saturn:["saturn","சனி"], rahu:["rahu","ராகு"], ketu:["ketu","கேது"],
  };
  return Object.keys(aliases).find((key) => aliases[key].some((alias) => alias.toLowerCase() === value)) || null;
}

function localizedStatus(affected, badlyAffected, language) {
  if (badlyAffected) return language === "ta" ? "மிகக் கடுமையாக பாதிக்கப்பட்டுள்ளது" : "Badly Affected";
  if (affected) return language === "ta" ? "பாதிப்பு அடைந்துள்ளது" : "Affected";
  return language === "ta" ? "பாதிப்பு இல்லை" : "Not Affected";
}

function buildD1D60Analysis({ lagna, planets, dasha, language = "ta" }) {
  const grahas = (planets || []).filter((p) => CLASSICAL_GRAHAS.has(p.key));
  const d1LagnaRasi = lagna.rasiNo;
  const d9LagnaRasi = getNavamsaRasiNumber(lagna.longitude);

  const d1Placements = grahas.map((p) => ({ key: p.key, rasiNo: p.rasiNo }));
  const d9Placements = grahas.map((p) => ({ key: p.key, rasiNo: getNavamsaRasiNumber(p.longitude) }));

  // Build all 60 divisional charts in the isolated extended-varga layer.
  const divisionalCharts = Array.from({ length: 60 }, (_, index) => {
    const division = index + 1;
    const lagnaDetails = longitudeDetails(getExtendedVargaLongitude(lagna.longitude, division), language);
    const chartPlanets = grahas.map((planet) => {
      const details = longitudeDetails(getExtendedVargaLongitude(planet.longitude, division), language);
      return { key:planet.key, name:planet.name, ...details };
    });
    return { chart:`D${division}`, division, lagna:lagnaDetails, planets:chartPlanets };
  });
  const chartMap = new Map(divisionalCharts.map((c) => [c.division, c]));
  const nakshatraFrequency = buildNakshatraFrequency(divisionalCharts, language);

  const planetAnalysis = grahas.map((planet) => {
    const d1 = evaluateChartAffliction({
      planet,
      rasiNo: planet.rasiNo,
      lagnaRasi: d1LagnaRasi,
      placements: d1Placements,
      includeCombust: true,
      language,
    });

    const d9Rasi = getNavamsaRasiNumber(planet.longitude);
    const d9 = evaluateChartAffliction({
      planet,
      rasiNo: d9Rasi,
      lagnaRasi: d9LagnaRasi,
      placements: d9Placements,
      includeCombust: false,
      language,
    });

    const allVargas = divisionalCharts.map((chart) => {
      const planetPos = chart.planets.find((p) => p.key === planet.key);
      const placements = chart.planets.map((p) => ({ key:p.key, rasiNo:p.rasiNo }));
      const affliction = evaluateChartAffliction({
        planet,
        rasiNo:planetPos.rasiNo,
        lagnaRasi:chart.lagna.rasiNo,
        placements,
        includeCombust: chart.division === 1,
        language,
      });
      return {
        chart:chart.chart,
        division:chart.division,
        longitude:planetPos.longitude,
        rasiNo:planetPos.rasiNo,
        rasi:planetPos.rasi,
        nakshatraNo:planetPos.nakshatraNo,
        nakshatra:planetPos.nakshatra,
        pada:planetPos.pada,
        affected:affliction.affected,
        house:affliction.house,
        reasons:affliction.reasons,
      };
    });

    const d60Row = getD60Row(planet.longitude);
    const d60Affected = ["inauspicious", "mixed"].includes(d60Row.natureCode);
    const d60 = {
      affected: d60Affected,
      division: d60Row.division,
      degreeRange: `${d60Row.startDegree.toFixed(1)}°-${d60Row.endDegree.toFixed(1)}°`,
      shashtiamshaName: d60Row.name,
      nature: language === "ta" ? d60Row.natureTa : ({
        inauspicious:"Inauspicious", mixed:"Mixed Auspicious/Inauspicious",
        auspicious:"Auspicious", highly_auspicious:"Highly Auspicious"
      }[d60Row.natureCode]),
      natureCode: d60Row.natureCode,
      reasons: d60Affected ? [{
        code: "d60_nature",
        ta: `D60 தன்மை: ${d60Row.natureTa}`,
        en: `D60 nature: ${d60Row.natureCode}`,
      }] : [],
    };

    const badlyAffected = d1.affected && d9.affected && d60.affected;
    const affected = d1.affected || d9.affected || d60.affected;

    return {
      key: planet.key,
      name: planet.name,
      affected,
      badlyAffected,
      severity: badlyAffected ? "badly_affected" : affected ? "affected" : "not_affected",
      status: localizedStatus(affected, badlyAffected, language),
      remedyAllowed: !badlyAffected,
      remedy: badlyAffected ? null : null,
      d1,
      d9,
      d60,
      affectedCount: allVargas.filter((v) => v.affected).length,
      affectedCharts: allVargas.filter((v) => v.affected).map((v) => v.chart),
      allVargas,
    };
  });

  const affectedPlanets = planetAnalysis.filter((p) => p.affected);
  const badlyAffectedPlanets = planetAnalysis.filter((p) => p.badlyAffected);

  const dashaKey = lordNameToKey(dasha?.currentDasha);
  const bhuktiKey = lordNameToKey(dasha?.currentBhukti);
  const dashaPlanet = planetAnalysis.find((p) => p.key === dashaKey) || null;
  const bhuktiPlanet = planetAnalysis.find((p) => p.key === bhuktiKey) || null;

  function buildPeriodStatus(period, item) {
    const titleTa = period === "dasha" ? "திசை நாதன்" : "புத்தி நாதன்";
    const titleEn = period === "dasha" ? "Dasha Lord" : "Bhukti Lord";
    if (!item) return { evaluated:false, affected:false, badlyAffected:false, message:null };
    const message = item.badlyAffected
      ? (language === "ta" ? `${titleTa} மிகக் கடுமையாக பாதிக்கப்பட்டுள்ளது` : `${titleEn} is Badly Affected`)
      : item.affected
        ? (language === "ta" ? `${titleTa} பாதிப்பு அடைந்துள்ளது` : `${titleEn} is Affected`)
        : (language === "ta" ? `${titleTa} பாதிப்பு இல்லை` : `${titleEn} is Not Affected`);
    return { evaluated:true, planetKey:item.key, planetName:item.name, affected:item.affected, badlyAffected:item.badlyAffected, message };
  }

  return {
    module: "D1-D60 affected planet analysis",
    phase: "D1_D9_D60_FOUNDATION",
    d2ToD59Status: "pending_locked_calculation_convention",
    evaluatedCharts: ["D1", "D9", "D60"],
    extendedD1D60: {
      phase: "D1_D60_PARASHARA_EXTENDED",
      calculationConvention: "client_confirmed_parashara_extended_D1_D60",
      status: "implemented",
      evaluatedCharts: Array.from({length:60}, (_,i)=>`D${i+1}`),
    },
    afflictionConditions: [
      "debilitation",
      "enemy_sign",
      "malefic_conjunction",
      "malefic_aspect",
      "houses_6_8_12",
      "combustion_in_D1",
      "D60_inauspicious_or_mixed_nature",
    ],
    badlyAffectedRule: {
      condition: "affected_in_D1_and_D9_and_D60",
      remedyAllowed: false,
      ta: "D1, D9, D60 மூன்றிலும் பாதிப்பு இருந்தால் மிகக் கடுமையாக பாதிக்கப்பட்டுள்ளது. பரிகாரம் இல்லை.",
      en: "If affected in D1, D9 and D60, the planet is Badly Affected. No remedy is provided.",
    },
    d60TableSource: "client_supplied_60_x_0_30_degree_table",
    d60TableCount: D60_ROWS.length,
    divisionalCharts,
    nakshatraFrequency,
    planets: planetAnalysis,
    affectedPlanets: affectedPlanets.map((p) => ({ key:p.key, name:p.name, severity:p.severity })),
    badlyAffectedPlanets: badlyAffectedPlanets.map((p) => ({ key:p.key, name:p.name })),
    currentDashaStatus: buildPeriodStatus("dasha", dashaPlanet),
    currentBhuktiStatus: buildPeriodStatus("bhukti", bhuktiPlanet),
  };
}

module.exports = {
  buildD1D60Analysis,
  getD60Row,
  getNavamsaRasiNumber,
  getExtendedVargaLongitude,
  longitudeDetails,
  buildNakshatraFrequency,
  D60_ROWS,
};
