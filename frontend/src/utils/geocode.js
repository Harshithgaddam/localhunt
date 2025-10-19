import api from './api';

const getCoordinates = async (address) => {
  // 1. Add a check to handle empty or invalid addresses immediately
  console.log(!address);
  console.log(typeof address !== 'string' );
  console.log(address.trim() === '');
  if (!address || typeof address !== 'string' || address.trim() === '') {
    console.error("Geocoding failed: No address provided.");
    return null; // Stop and return null if the address is bad
  }

  try {
    const response = await api.get("https://nominatim.openstreetmap.org/search", {
      // 2. Make sure the 'q' parameter is set to the address
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      // Adding a User-Agent is good practice for OSM's API
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
      return null; // No results found for the address
    }
  } catch (error) {
    // Log the detailed error from the API call
    console.error("Error during geocoding API call:", error.response ? error.response.data : error.message);
    return null;
  }
};

module.exports = getCoordinates;
