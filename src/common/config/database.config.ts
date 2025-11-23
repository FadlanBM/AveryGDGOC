import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
  name: process.env.DB_NAME,
  options: {
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10),
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '2', 10),
    connectTimeoutMS: parseInt(
      process.env.DB_SERVER_SELECTION_TIMEOUT || '10000',
      10,
    ),
    socketTimeoutMS: 45000,
    retryAttempts: 3,
    retryDelay: 1000,
    ssl: process.env.NODE_ENV === 'production',
  },
}));
