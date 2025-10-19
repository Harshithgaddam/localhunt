// In api/vendors/index.js
import axios from 'axios';
import dbConnect from '../../backend/utils/dbConnect';
import Vendor from '../../backend/models/Vendor';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await dbConnect();
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location query parameter is required" });
    }

    try {
      // Step 1: Call your own geocode API
      const geocodeUrl = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/geocode?location=${encodeURIComponent(location)}`;
      const geoResponse = await axios.get(geocodeUrl);

      if (!geoResponse.data || geoResponse.data.length === 0) {
        return res.status(400).json({ message: "Invalid location. Could not fetch coordinates." });
      }
      const coords = { lat: geoResponse.data[0].lat, lon: geoResponse.data[0].lon };

      // Step 2: Fetch vendors from your DB
      const dbVendors = await Vendor.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(coords.lon), parseFloat(coords.lat)] },
            $maxDistance: 5000 // 5km radius
          }
        }
      }).populate("owner", "name");

      // Step 3: Call your own OSM API
      const osmApiUrl = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/osm?lat=${coords.lat}&lon=${coords.lon}&radius=1000`;
      const osmResponse = await axios.get(osmApiUrl);
      const normalizedOsmShops = osmResponse.data; // Assuming your /api/osm already normalizes the data

      // Step 4: Combine and send
      const combinedResults = [...dbVendors, ...normalizedOsmShops];
      res.status(200).json(combinedResults);

    } catch (error) {
      console.error("Vendor search error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}