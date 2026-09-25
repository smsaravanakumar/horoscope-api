const http = require("http");
const express = require("express");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function postJson({ port, pathName, payload }) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: pathName,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 30000,
      },
      (res) => {
        let text = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => { text += chunk; });
        res.on("end", () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(text || "{}") });
          } catch (error) {
            reject(new Error(`Non-JSON response: ${text.slice(0, 300)}`));
          }
        });
      }
    );

    req.on("timeout", () => req.destroy(new Error("Request timed out")));
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Force the external geocoder to fail. The request must still succeed because
  // valid explicit coordinates are supplied in the payload.
  const geocodePath = require.resolve("../services/geocodeService");
  const originalGeocodeModule = require(geocodePath);
  require.cache[geocodePath].exports = {
    ...originalGeocodeModule,
    getCoordinates: async () => {
      throw new Error("TEST FAILURE: external geocoder must not be called");
    },
  };

  const routePath = require.resolve("../routes/horoscope");
  delete require.cache[routePath];
  const horoscopeRoutes = require("../routes/horoscope");

  const app = express();
  app.use(express.json());
  app.use("/api/horoscope", horoscopeRoutes);

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });

  let pass = 0;
  let fail = 0;
  function check(name, fn) {
    try {
      fn();
      console.log(`PASS: ${name}`);
      pass += 1;
    } catch (error) {
      console.error(`FAIL: ${name}`);
      console.error(`      ${error.message}`);
      fail += 1;
    }
  }

  try {
    const response = await postJson({
      port: server.address().port,
      pathName: "/api/horoscope/generate",
      payload: {
        name: "Render Coordinate Bypass UAT",
        gender: "male",
        birthDate: "04-04-1971",
        birthTime: "7:52 AM",
        place: "Kanniyakumari",
        latitude: 8.3279814,
        longitude: 77.3541173,
        language: "ta",
      },
    });

    check("Explicit coordinates bypass external geocoder", () => {
      assert(response.statusCode === 200,
        `Expected 200, got ${response.statusCode}: ${JSON.stringify(response.body).slice(0, 500)}`);
    });
    check("API success remains true", () => {
      assert(response.body.success === true, "success must be true");
    });
    check("Response returns supplied latitude/longitude", () => {
      assert(response.body.coordinates?.latitude === 8.3279814, "latitude mismatch");
      assert(response.body.coordinates?.longitude === 77.3541173, "longitude mismatch");
    });
    check("Ashtakavarga remains correct", () => {
      assert(response.body.ashtakavarga?.grandTotal === 337,
        `Expected Ashtakavarga grandTotal 337, got ${response.body.ashtakavarga?.grandTotal}`);
    });
    check("Mole/Scar analysis remains present", () => {
      assert(response.body.moleScarAnalysis && typeof response.body.moleScarAnalysis === "object",
        "moleScarAnalysis missing");
    });

    const incomplete = await postJson({
      port: server.address().port,
      pathName: "/api/horoscope/generate",
      payload: {
        birthDate: "04-04-1971",
        birthTime: "7:52 AM",
        place: "Kanniyakumari",
        latitude: 8.3279814,
        language: "ta",
      },
    });
    check("Latitude without longitude is rejected", () => {
      assert(incomplete.statusCode === 400, `Expected 400, got ${incomplete.statusCode}`);
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    require.cache[geocodePath].exports = originalGeocodeModule;
  }

  console.log(`\nTOTAL PASS : ${pass}`);
  console.log(`TOTAL FAIL : ${fail}`);
  if (fail > 0) {
    process.exitCode = 1;
    return;
  }
  console.log("\nRENDER COORDINATE BYPASS UAT: PASS");
}

main().catch((error) => {
  console.error("RENDER COORDINATE BYPASS UAT: FAIL");
  console.error(error);
  process.exitCode = 1;
});
