
import axios from 'axios';

export const fetchOSMShops = async (lat, lon, radius = 1000) => {
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
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(query)}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
   
    return response.data.elements
      .filter(el => (el.lat && el.lon) || (el.center?.lat && el.center?.lon))
      .map((el) => ({
        _id: `osm-${el.id}`,
        businessName: el.tags?.name || "Unnamed Shop",
        address: el.tags?.["addr:street"] || el.tags?.["addr:full"] || "Address not available",
        category: el.tags?.shop || "Unknown",
        location: {
          type: 'Point',
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
    return []; 
  }
};