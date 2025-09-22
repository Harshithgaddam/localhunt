const axios = require("axios");

async function getCoordinates(address) {
  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: address,
      format: "json",
      limit: 1
    }
  });

  if (response.data.length === 0) return null;

  return {
    lat: parseFloat(response.data[0].lat),
    lon: parseFloat(response.data[0].lon)
  };
}

module.exports = getCoordinates;
