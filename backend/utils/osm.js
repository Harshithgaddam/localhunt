// utils/osm.js
import axios from "axios";

export async function fetchOSMShops(lat, lon, radius = 500) {
  // Overpass API query to get shops around given coordinates
  const query = `
    [out:json];
    (
      node["shop"](around:${radius},${lat},${lon});
      way["shop"](around:${radius},${lat},${lon});
      relation["shop"](around:${radius},${lat},${lon});
    );
    out center;
  `;
 
  const url = "https://overpass-api.de/api/interpreter";
  const response = await axios.post(url, query, {
    headers: { "Content-Type": "text/plain" },
  });

  // Convert OSM format → simple vendor-like format
  return response.data.elements.map((el) => ({
    id: `osm-${el.id}`,
    businessName: el.tags?.name || "Unnamed Shop",
    address: el.tags?.["addr:street"] || "No address",
    location: {
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
    },
    source: "OSM",
  }));
}
