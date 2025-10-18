// backend/utils/dbConnect.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env or Vercel environment variables'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // If a connection is already cached, return it
    return cached.conn;
  }

  if (!cached.promise) {
    // If no connection promise is cached, create one
    const opts = {
      bufferCommands: false, // Recommended for serverless
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('New MongoDB Connection Established');
      return mongoose;
    });
  }
  
  try {
    // Wait for the connection promise to resolve and cache the connection
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise and rethrow the error
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;