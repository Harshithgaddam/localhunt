// // // utils/osm.js
// // import axios from "axios";

// // export async function fetchOSMShops(lat, lon, radius = 500) {
// //   const query = `
// //     [out:json];
// //     (
// //       node["shop"](around:${radius},${lat},${lon});
// //       way["shop"](around:${radius},${lat},${lon});
// //       relation["shop"](around:${radius},${lat},${lon});
// //     );
// //     out center;
// //   `;
 
// //   const url = "https://overpass-api.de/api/interpreter";
// //   const response = await axios.post(url, query, {
// //     headers: { "Content-Type": "text/plain" },
// //   });

// //   return response.data.elements.map((el) => ({
// //     id: `osm-${el.id}`,
// //     businessName: el.tags?.name || "Unnamed Shop",
// //     address: el.tags?.["addr:street"] || el.tags?.["addr:full"] || "No address",
// //     phone: el.tags?.["phone"] || el.tags?.["contact:phone"] || null,
// //     website: el.tags?.["website"] || el.tags?.["contact:website"] || null,
// //     openingHours: el.tags?.["opening_hours"] || null,
// //     category: el.tags?.["shop"] || "Unknown",
// //     brand: el.tags?.["brand"] || null,
// //     email: el.tags?.["email"] || el.tags?.["contact:email"] || null,
// //     location: {
// //       lat: el.lat || el.center?.lat,
// //       lon: el.lon || el.center?.lon,
// //     },
// //     source: "OSM",
// //   }));
// // }
// import axios from 'axios';

// export const fetchOSMShops = async (lat, lon, radius = 1000) => {
//   // Overpass QL query to find nodes with a "shop" tag within a radius
//   const query = `
//     [out:json];
//     (
//       node["shop"](around:${radius},${lat},${lon});
//     );
//     out ;
//   `;

//   try {
//     const response = await axios.post(
//       'https://overpass-api.de/api/interpreter',
//       `data=${encodeURIComponent(query)}`,
//       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//     );
    
//     // The API returns an object with an "elements" array
//     return response.data.elements;
//   } catch (error) {
//     console.error("Error fetching data from OpenStreetMap:", error);
//     return []; // Return an empty array on error
//   }
// };
// In src/utils/osm.js
import axios from 'axios';

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
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      `data=${encodeURIComponent(query)}`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    
    // ✅ Returning a CLEAN, NORMALIZED array, just like your commented code did
    // This filters out any results that are missing coordinates
    console.log(response.data.elements);
    return response.data.elements
      .filter(el => (el.lat && el.lon) || (el.center?.lat && el.center?.lon))
      .map((el) => ({
        _id: `osm-${el.id}`,
        businessName: el.tags?.name || "Unnamed Shop",
        address: el.tags?.["addr:street"] || el.tags?.["addr:full"] || "Address not available",
        // This creates the location object in the correct format for your app
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