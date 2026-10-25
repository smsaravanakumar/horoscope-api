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
  return normalizeDegree(radToDeg(Math.atan2(numerator, denominator)));
}

function siderealAscendant(date, latitude, longitude, ayanamsa) {
  return normalizeDegree(
    getAscendantTropicalLongitude(date, latitude, longitude) - ayanamsa
  );
}

function parseLocalDate(dateText) {
  const [day, month, year] = dateText.split("-").map(Number);
  return { day, month, year };
}

function localMidnightUtc(dateText) {
  const { day, month, year } = parseLocalDate(dateText);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - IST_OFFSET_MINUTES * 60000);
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
  const sign = ms < 0 ? "-" : "+";
  const totalMinutes = Math.abs(ms) / 60000;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${sign}${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function searchRiseSet(body, observer, direction, startDate, limitDays) {
  return Astronomy.SearchRiseSet(body, observer, direction, startDate, limitDays);
}

function findExpectedMandiTime(sample, latitude, longitude, ayanamsa) {
  const start = new Date(localMidnightUtc(sample.birthDate).getTime() - 6 * 3600000);
  const end = new Date(start.getTime() + 36 * 3600000);
  let best = null;

  for (let time = start.getTime(); time <= end.getTime(); time += 60000) {
    const date = new Date(time);
    const longitudeAtTime = siderealAscendant(date, latitude, longitude, ayanamsa);
    const difference = angularDifference(longitudeAtTime, sample.expectedMandi);
    if (!best || difference < best.difference) {
      best = { date, longitude: longitudeAtTime, difference };
    }
  }

  // Refine around the best minute in one-second steps.
  const refineStart = best.date.getTime() - 60000;
  const refineEnd = best.date.getTime() + 60000;
  for (let time = refineStart; time <= refineEnd; time += 1000) {
    const date = new Date(time);
    const longitudeAtTime = siderealAscendant(date, latitude, longitude, ayanamsa);
    const difference = angularDifference(longitudeAtTime, sample.expectedMandi);
    if (difference < best.difference) {
      best = { date, longitude: longitudeAtTime, difference };
    }
  }

  return best;
}

async function callApi(sample) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Mandi Diagnostic",
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
  const expected = findExpectedMandiTime(sample, latitude, longitude, ayanamsa);
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const localMidnight = localMidnightUtc(sample.birthDate);
  const previousDay = new Date(localMidnight.getTime() - 24 * 3600000);

  const sunrise = searchRiseSet(Astronomy.Body.Sun, observer, +1, previousDay, 3)?.date;
  const sunset = searchRiseSet(Astronomy.Body.Sun, observer, -1, previousDay, 3)?.date;
  const nextSunrise = sunrise
    ? searchRiseSet(Astronomy.Body.Sun, observer, +1, new Date(sunrise.getTime() + 60000), 2)?.date
    : null;

  const currentMandi = data.planets.find((planet) => planet.key === "mandi");
  const birthDate = new Date(data.normalizedInput.isoDateTime);

  console.log("\n" + "=".repeat(84));
  console.log(`${sample.id}: ${sample.birthDate}, ${sample.birthTime}, ${sample.place}`);
  console.log("-".repeat(84));
  console.log(`Coordinates        : ${latitude}, ${longitude}`);
  console.log(`Birth IST          : ${formatIst(birthDate)}`);
  console.log(`API current Mandi  : ${currentMandi?.rasi || "?"} ${currentMandi?.degreeMinute || "?"}`);
  console.log(`Reference Mandi    : total longitude ${sample.expectedMandi.toFixed(6)}°`);
  console.log(`Implied Mandi time : ${formatIst(expected.date)}`);
  console.log(`Matched longitude  : ${expected.longitude.toFixed(6)}°`);
  console.log(`Residual error     : ${(expected.difference * 60).toFixed(3)} arc-minutes`);

  if (sunrise && sunset && nextSunrise) {
    console.log(`Sunrise candidate  : ${formatIst(sunrise)}`);
    console.log(`Sunset candidate   : ${formatIst(sunset)}`);
    console.log(`Next sunrise       : ${formatIst(nextSunrise)}`);

    if (expected.date >= sunrise && expected.date < sunset) {
      const fraction = (expected.date - sunrise) / (sunset - sunrise);
      console.log(`Day elapsed        : ${formatDuration(expected.date - sunrise)}`);
      console.log(`Day fraction       : ${fraction.toFixed(6)} of day = ${(fraction * 8).toFixed(4)} / 8 parts`);
      console.log(`Ghatis after rise  : ${(fraction * 30).toFixed(4)} ghatis`);
    } else {
      const effectiveSunset = expected.date >= sunset ? sunset : new Date(sunset.getTime() - 86400000);
      const effectiveNextSunrise = expected.date >= sunset ? nextSunrise : sunrise;
      const fraction = (expected.date - effectiveSunset) / (effectiveNextSunrise - effectiveSunset);
      console.log(`Night elapsed      : ${formatDuration(expected.date - effectiveSunset)}`);
      console.log(`Night fraction     : ${fraction.toFixed(6)} of night = ${(fraction * 8).toFixed(4)} / 8 parts`);
      console.log(`Ghatis after set   : ${(fraction * 30).toFixed(4)} ghatis`);
    }
  }
}

async function main() {
  console.log("MANDI CONVENTION DIAGNOSTIC");
  console.log(`API: ${API_URL}`);
  console.log("This script does not modify any project file.\n");

  for (const sample of samples) {
    try {
      await diagnoseSample(sample);
    } catch (error) {
      console.error(`\n${sample.id} FAILED: ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(84));
  console.log("Copy the complete output and send it for convention analysis.");
}

main().catch((error) => {
  console.error("Diagnostic failed:", error);
  process.exitCode = 1;
});
