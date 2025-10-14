import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const env = {
  // Server Configuration
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  PORT: parseInt(process.env['PORT'] || '5050', 10),

  // Database Configuration
  MONGODB_URI: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/marketing_cms',

  // JWT Configuration
  JWT_SECRET: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '7d',

  // CORS Configuration
  CORS_ORIGIN: process.env['CORS_ORIGIN'] || '*',

  // Logging
  LOG_LEVEL: process.env['LOG_LEVEL'] || 'http',
} as const;

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
