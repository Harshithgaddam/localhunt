// In api/vendors/[id].js
import dbConnect from '../../backend/utils/dbConnect';
import Vendor from '../../backend/models/Vendor';
import Product from '../../backend/models/Product';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    await dbConnect();
    try {
      const vendor = await Vendor.findById(id);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      const products = await Product.find({ vendorId: id });
      res.json({ vendor, products });
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}