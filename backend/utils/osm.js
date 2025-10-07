// utils/osm.js
import axios from "axios";

export async function fetchOSMShops(lat, lon, radius = 500) {
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

  return response.data.elements.map((el) => ({
    id: `osm-${el.id}`,
    businessName: el.tags?.name || "Unnamed Shop",
    address: el.tags?.["addr:street"] || el.tags?.["addr:full"] || "No address",
    phone: el.tags?.["phone"] || el.tags?.["contact:phone"] || null,
    website: el.tags?.["website"] || el.tags?.["contact:website"] || null,
    openingHours: el.tags?.["opening_hours"] || null,
    category: el.tags?.["shop"] || "Unknown",
    brand: el.tags?.["brand"] || null,
    email: el.tags?.["email"] || el.tags?.["contact:email"] || null,
    location: {
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
    },
    source: "OSM",
  }));
}
