const axios = require("axios");

async function getCoordinates(place) {
  try {
    const url = "https://nominatim.openstreetmap.org/search";

    const response = await axios.get(url, {
      params: {
        q: place,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "HoroscopeApp/1.0",
      },
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("Location not found");
    }

    return {
      latitude: parseFloat(response.data[0].lat),
      longitude: parseFloat(response.data[0].lon),
    };
  } catch (error) {
    throw new Error("Geocoding failed: " + error.message);
  }
}

module.exports = {
  getCoordinates,
};