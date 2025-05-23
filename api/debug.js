// Debug file to help troubleshoot API issues on Vercel
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API endpoint for debugging
export default async function handler(req, res) {
  try {
    // Check if MongoDB URI is set
    const mongoUri = process.env.MONGODB_URI || 'Not set';
    const maskedUri = mongoUri !== 'Not set' 
      ? mongoUri.replace(/:\/\/([^:]+):([^@]+)@/, '://****:****@') 
      : mongoUri;

    // Try to connect to MongoDB
    let dbStatus = 'Not connected';
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      dbStatus = 'Connected successfully';
    } catch (dbError) {
      dbStatus = `Connection error: ${dbError.message}`;
    }

    // Return debug information
    return res.status(200).json({
      status: 'API is running',
      environment: process.env.NODE_ENV || 'Not set',
      mongodbUri: maskedUri,
      mongodbStatus: dbStatus,
      serverTime: new Date().toISOString(),
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Debug endpoint error',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🙈' : error.stack,
    });
  }
}
