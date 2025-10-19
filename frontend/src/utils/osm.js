import api from './api';
export const fetchOSMShops = async (lat, lon, radius = 1000) => {
  // ✅ Using a more complete query to find different types of map elements
  // ✅ Using 'out;' to get the full data including all tags (like name, address, etc.)
  const query = `
    [out:json];
    (
      node["shop"](around:${radius},${lat},${lon});
      way["shop"](around:${radius},${lat},${lon});
      relation["shop"](around:${radius},${lat},${lon});
    );
    out;
  `;

  try {
    const response = await api.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(query)}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    // ✅ Returning a CLEAN, NORMALIZED array, just like your commented code did
    // This filters out any results that are missing coordinates
    return response.data.elements
      .filter(el => (el.lat && el.lon) || (el.center?.lat && el.center?.lon))
      .map((el) => ({
        _id: `osm-${el.id}`,
        businessName: el.tags?.name || "Unnamed Shop",
        address: el.tags?.["addr:street"] || el.tags?.["addr:full"] || "Address not available",
        // This creates the location object in the correct format for your app
        category: el.tags?.shop || "Unknown",
        location: {
          type: 'Point',
          // Use 'el.center' as a fallback for complex shapes like buildings (ways/relations)
          coordinates: [
            parseFloat(el.lon || el.center.lon), 
            parseFloat(el.lat || el.center.lat)
          ]
        },
        owner: { name: 'Map Listing' },
        source: "OSM",
    }));
  } catch (error) {
    console.error("Error fetching data from OpenStreetMap:", error);
    return []; // Return an empty array on error
  }
};