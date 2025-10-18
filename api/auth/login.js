// api/auth/login.js

import User from '../../backend/models/User';
import jwt from 'jsonwebtoken';
import dbConnect from '../../backend/utils/dbConnect'; // Helper to connect to the DB

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

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      // 2. Your original login logic is placed here
      if (user && (await user.matchPassword(password))) {
        res.status(200).json({
          token: createToken(user),
          user: { // Send back user info for the frontend
            _id: user._id,
            name: user.name,
            email: user.email,
            accountType: user.accountType
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  } else {
    // 3. Reject any method that is not POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}