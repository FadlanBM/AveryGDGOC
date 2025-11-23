import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kosku',
  dialect: 'postgres' as const,
  ssl: process.env.NODE_ENV === 'production' ? {
    require: true,
    rejectUnauthorized: false
  } : false,
  pool: {
    max: parseInt(process.env.DB_MAX_POOL_SIZE || '5', 10),
    min: parseInt(process.env.DB_MIN_POOL_SIZE || '0', 10),
    acquire: 30000,
    idle: 10000
  },
  logging: process.env.NODE_ENV === 'development',
}));
