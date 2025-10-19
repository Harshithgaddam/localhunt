// In api/vendors/nearby.js
import dbConnect from '../../backend/utils/dbConnect';
import Vendor from '../../backend/models/Vendor';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await dbConnect();
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) {
        return res.status(400).json({ message: 'Latitude and longitude are required.' });
      }
      const vendors = await Vendor.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] },
            $maxDistance: 10000 // 10km radius
          }
        }
      });
      res.json(vendors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching nearby vendors.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}