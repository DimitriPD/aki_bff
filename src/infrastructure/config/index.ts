import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'aki_mock_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  services: {
    personas: {
      baseUrl: process.env.PERSONAS_BASE_URL || 'http://localhost:3002',
      timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '8000', 10),
    },
    core: {
      baseUrl: process.env.CORE_BASE_URL || 'http://localhost:3001',
      timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '8000', 10),
    },
    functionPassword: {
      baseUrl: process.env.FUNCTION_PASSWORD_URL || 'http://localhost:7072',
      timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '8000', 10),
    },
    functionNotification: {
      baseUrl: process.env.FUNCTION_NOTIFICATION_URL || 'http://localhost:7071',
      timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '8000', 10),
    },
  },
  
  http: {
    maxRetries: parseInt(process.env.MAX_RETRIES || '2', 10),
    retryDelay: 1000, // milliseconds
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  
  mock: {
    authEnabled: process.env.MOCK_AUTH_ENABLED === 'true',
    teacherId: parseInt(process.env.MOCK_TEACHER_ID || '1', 10),
  },
};
