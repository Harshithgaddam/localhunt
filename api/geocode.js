
const axios = require('axios');

const getCoordinates = async (address) => {
  console.log(!address);
  console.log(typeof address !== 'string' );
  console.log(address.trim() === '');
  if (!address || typeof address !== 'string' || address.trim() === '') {
    console.error("Geocoding failed: No address provided.");
    return null; 
  }

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        'User-Agent': 'LocalHuntApp/1.0 (1okkadu@gmail.com)'
      }
    });
    console.log(response.data);
    console.log(response.data && response.data.length > 0);
    if (response.data && response.data.length > 0) {
      
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
            console.log("in else block");
      return null; 
    }
  } catch (error) {
    console.error("Error during geocoding API call:", error.response ? error.response.data : error.message);
    return null;
  }
};

module.exports = getCoordinates;
