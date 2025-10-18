// api/auth/register.js

import User from '../../backend/models/User';
import Vendor from '../../backend/models/Vendor';
import jwt from 'jsonwebtoken';
import dbConnect from '../../backend/utils/dbConnect';
import { getCoordinates } from '../../backend/utils/geocode'; // Assuming geocode is a utility

// Helper function to create a token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, accountType: user.accountType },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

export default async function handler(req, res) {
  // 1. Check if the request method is POST
  if (req.method === 'POST') {
    await dbConnect(); // Ensure DB is connected

    const { name, email, password, accountType, businessName, address, phone, businessHours } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      const coords = await getCoordinates(address);
      if (!coords) {
        return res.status(400).json({ message: "Invalid address. Could not fetch coordinates." });
      }

      // 2. Your original registration logic is placed here
      const user = await User.create({ name, email, password, accountType });

      if (user && accountType === 'vendor') {
        await Vendor.create({
          owner: user._id,
          businessName,
          address,
          location: {
            type: "Point",
            coordinates: [coords.lon, coords.lat] 
          },
          contactInfo: { phone: phone },
          businessHours: businessHours,
        });
      }

      res.status(201).json({ 
        token: createToken(user),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          accountType: user.accountType
        }
      });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  } else {
    // 3. Reject any method that is not POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}