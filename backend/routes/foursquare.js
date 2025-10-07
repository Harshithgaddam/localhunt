// backend/routes/foursquare.js
import express from "express";
import axios from "axios";

const router = express.Router();
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY; // store in .env

// GET /api/businesses?lat=..&lon=..&query=..
router.get("/api/businesses", async (req, res) => {
  const { lat, lon, query } = req.query;

  try {
    const response = await axios.get("https://api.foursquare.com/v3/places/search", {
      params: {
        ll: `${lat},${lon}`,
        query: query || "",
        radius: 1000,        // radius in meters
        limit: 50            // max 50 results per request
      },
      headers: {
        Authorization: `Bearer ${FOURSQUARE_API_KEY}`
      }
    });

    const businesses = response.data.results.map(b => ({
      id: b.fsq_id,
      name: b.name,
      address: b.location.formatted_address || "No address",
      category: b.categories[0]?.name || "Unknown",
      lat: b.geocodes.main.latitude,
      lon: b.geocodes.main.longitude,
      phone: b.tel || null,
      website: b.website || null,
      rating: b.rating || null,
      photos: b.photos || []  // may contain photo URLs
    }));

    res.json(businesses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
});

export default router;
