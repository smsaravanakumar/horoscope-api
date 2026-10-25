"use strict";

const Astronomy = require("astronomy-engine");

const API_URL = "http://localhost:3000/api/horoscope/generate";
const IST_OFFSET_MINUTES = 330;

const samples = [
  { id: "S1", birthDate: "16-03-2001", birthTime: "07:30 PM", place: "Kanniyakumari", expectedMandi: 350 + 20 / 60 },
  { id: "S2", birthDate: "04-04-1971", birthTime: "07:52 AM", place: "Tirunelveli", expectedMandi: 120 + 26 + 13 / 60 },
  { id: "S3", birthDate: "19-05-1999", birthTime: "03:03 PM", place: "Chennai", expectedMandi: 90 + 28 + 8 / 60 },
  { id: "S4", birthDate: "17-09-1982", birthTime: "06:10 AM", place: "Madurai", expectedMandi: 210 + 6 + 11 / 60 },
  { id: "S5", birthDate: "26-06-1988", birthTime: "10:10 AM", place: "Chennai", expectedMandi: 270 + 17 + 6 / 60 },
];

const DAY_MID_PARTS = [6.5, 5.5, 4.5, 3.5, 2.5, 1.5, 0.5];
const DAY_END_PARTS = [7, 6, 5, 4, 3, 2, 1];
const NIGHT_MID_PARTS = [2.5, 1.5, 0.5, 6.5, 5.5, 4.5, 3.5];
const NIGHT_END_PARTS = [3, 2, 1, 7, 6, 5, 4];

function normalizeDegree(value) {
  let result = value % 360;
  if (result < 0) result += 360;
  return result;
}

function angularDifference(a, b) {
  const diff = Math.abs(normalizeDegree(a) - normalizeDegree(b));
  return Math.min(diff, 360 - diff);
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

function getJulianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function getGMST(date) {
  const jd = getJulianDay(date);
  const t = (jd - 2451545.0) / 36525.0;
  return normalizeDegree(
    280.46061837 +
      360.98564736629 * (jd - 2451545.0) +
      0.000387933 * t * t -
      (t * t * t) / 38710000.0
  );
}

function getAscendantTropicalLongitude(date, latitude, longitude) {
  const lst = normalizeDegree(getGMST(date) + longitude);
  const epsilon = 23.4392911;
  const theta = degToRad(lst);
  const phi = degToRad(latitude);
  const eps = degToRad(epsilon);
  const numerator = -Math.cos(theta);
  const denominator =
    Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);

  // IMPORTANT: +180 selects the eastern horizon intersection (actual Lagna).
  return normalizeDegree(radToDeg(Math.atan2(numerator, denominator)) + 180);
}

function siderealAscendant(date, latitude, longitude, ayanamsa) {
  return normalizeDegree(
    getAscendantTropicalLongitude(date, latitude, longitude) - ayanamsa
  );
}

function formatIst(date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDuration(ms) {
  const totalMinutes = Math.round(Math.abs(ms) / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function getIndiaWeekday(date) {
  return new Date(date.getTime() + IST_OFFSET_MINUTES * 60000).getUTCDay();
}

function searchEvent(observer, direction, startDate, limitDays = 3) {
  return Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    direction,
    startDate,
    limitDays
  )?.date || null;
}

function getRelevantSolarInterval(birthDate, latitude, longitude) {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const start = new Date(birthDate.getTime() - 36 * 3600000);

  const rises = [];
  const sets = [];
  let cursorRise = start;
  let cursorSet = start;

  for (let i = 0; i < 4; i += 1) {
    const rise = searchEvent(observer, +1, cursorRise, 3);
    if (rise) {
      rises.push(rise);
      cursorRise = new Date(rise.getTime() + 60000);
    }
    const set = searchEvent(observer, -1, cursorSet, 3);
    if (set) {
      sets.push(set);
      cursorSet = new Date(set.getTime() + 60000);
    }
  }

  const birthMs = birthDate.getTime();
  const previousRise = [...rises].reverse().find((d) => d.getTime() <= birthMs);
  const nextRise = rises.find((d) => d.getTime() > birthMs);
  const previousSet = [...sets].reverse().find((d) => d.getTime() <= birthMs);
  const nextSet = sets.find((d) => d.getTime() > birthMs);

  const isDay = Boolean(
    previousRise &&
      nextSet &&
      previousRise.getTime() <= birthMs &&
      birthMs < nextSet.getTime() &&
      (!previousSet || previousRise.getTime() > previousSet.getTime())
  );

  if (isDay) {
    return { type: "DAY", start: previousRise, end: nextSet };
  }

  if (!previousSet || !nextRise) {
    throw new Error("Unable to determine night interval");
  }

  return { type: "NIGHT", start: previousSet, end: nextRise };
}

function findExpectedMandiTimeWithinInterval(
  expectedLongitude,
  latitude,
  longitude,
  ayanamsa,
  start,
  end
) {
  let best = null;

  for (let time = start.getTime(); time <= end.getTime(); time += 30000) {
    const date = new Date(time);
    const value = siderealAscendant(date, latitude, longitude, ayanamsa);
    const difference = angularDifference(value, expectedLongitude);
    if (!best || difference < best.difference) {
      best = { date, longitude: value, difference };
    }
  }

  const refineStart = Math.max(start.getTime(), best.date.getTime() - 60000);
  const refineEnd = Math.min(end.getTime(), best.date.getTime() + 60000);
  for (let time = refineStart; time <= refineEnd; time += 250) {
    const date = new Date(time);
    const value = siderealAscendant(date, latitude, longitude, ayanamsa);
    const difference = angularDifference(value, expectedLongitude);
    if (difference < best.difference) {
      best = { date, longitude: value, difference };
    }
  }

  return best;
}

function candidateResult(label, part, interval, latitude, longitude, ayanamsa, expected) {
  const date = new Date(
    interval.start.getTime() +
      (part / 8) * (interval.end.getTime() - interval.start.getTime())
  );
  const value = siderealAscendant(date, latitude, longitude, ayanamsa);
  return {
    label,
    part,
    date,
    value,
    errorMinutes: angularDifference(value, expected) * 60,
  };
}

async function callApi(sample) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Mandi Diagnostic V2",
      gender: "male",
      birthDate: sample.birthDate,
      birthTime: sample.birthTime,
      place: sample.place,
      language: "ta",
    }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`API returned non-JSON (${response.status}): ${text.slice(0, 300)}`);
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || `API request failed with ${response.status}`);
  }
  return data;
}

async function diagnoseSample(sample) {
  const data = await callApi(sample);
  const { latitude, longitude } = data.coordinates;
  const ayanamsa = data.ayanamsa;
  const birthDate = new Date(data.normalizedInput.isoDateTime);
  const currentMandi = data.planets.find((p) => p.key === "mandi");
  const interval = getRelevantSolarInterval(birthDate, latitude, longitude);
  const weekday = getIndiaWeekday(birthDate);

  const implied = findExpectedMandiTimeWithinInterval(
    sample.expectedMandi,
    latitude,
    longitude,
    ayanamsa,
    interval.start,
    interval.end
  );

  const fraction =
    (implied.date.getTime() - interval.start.getTime()) /
    (interval.end.getTime() - interval.start.getTime());
  const impliedPart = fraction * 8;
  const impliedGhati = fraction * 30;

  const midPart = interval.type === "DAY" ? DAY_MID_PARTS[weekday] : NIGHT_MID_PARTS[weekday];
  const endPart = interval.type === "DAY" ? DAY_END_PARTS[weekday] : NIGHT_END_PARTS[weekday];

  const candidates = [
    candidateResult("MIDPOINT", midPart, interval, latitude, longitude, ayanamsa, sample.expectedMandi),
    candidateResult("ENDPOINT", endPart, interval, latitude, longitude, ayanamsa, sample.expectedMandi),
  ];

  console.log("\n" + "=".repeat(92));
  console.log(`${sample.id}: ${sample.birthDate}, ${sample.birthTime}, ${sample.place}`);
  console.log("-".repeat(92));
  console.log(`Birth IST             : ${formatIst(birthDate)}`);
  console.log(`Weekday index         : ${weekday} (0=Sun ... 6=Sat)`);
  console.log(`Birth type            : ${interval.type}`);
  console.log(`Interval start        : ${formatIst(interval.start)}`);
  console.log(`Interval end          : ${formatIst(interval.end)}`);
  console.log(`Interval duration     : ${formatDuration(interval.end - interval.start)}`);
  console.log(`API current Mandi     : ${currentMandi?.rasi || "?"} ${currentMandi?.degreeMinute || "?"}`);
  console.log(`Reference longitude   : ${sample.expectedMandi.toFixed(6)}°`);
  console.log(`Implied time          : ${formatIst(implied.date)}`);
  console.log(`Matched longitude     : ${implied.longitude.toFixed(6)}°`);
  console.log(`Residual error        : ${(implied.difference * 60).toFixed(3)} arc-minutes`);
  console.log(`Implied interval part : ${impliedPart.toFixed(4)} / 8`);
  console.log(`Implied ghati         : ${impliedGhati.toFixed(4)} after interval start`);

  for (const candidate of candidates) {
    console.log(
      `${candidate.label.padEnd(21)}: part ${candidate.part.toFixed(1)}/8, ${formatIst(candidate.date)}, ` +
        `lon ${candidate.value.toFixed(6)}°, error ${candidate.errorMinutes.toFixed(2)}′`
    );
  }
}

async function main() {
  console.log("MANDI CONVENTION DIAGNOSTIC V2");
  console.log(`API: ${API_URL}`);
  console.log("Corrected eastern-horizon Lagna (+180°) and restricted search to the birth day/night interval.");
  console.log("This script does not modify any project file.\n");

  for (const sample of samples) {
    try {
      await diagnoseSample(sample);
    } catch (error) {
      console.error(`\n${sample.id} FAILED: ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(92));
  console.log("Copy the complete output and send it for final Mandi convention analysis.");
}

main().catch((error) => {
  console.error("Diagnostic failed:", error);
  process.exitCode = 1;
});
