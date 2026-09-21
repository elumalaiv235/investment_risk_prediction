import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'riskwise_jwt_super_secret_key_change_in_production_2026',
  SESSION_SECRET: process.env.SESSION_SECRET || 'riskwise_session_super_secret_key_change_in_production_2026',
  APP_URL: process.env.APP_URL || 'http://localhost:5173',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_EXPIRES_IN: '7d',
};
