import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logLevel = process.env.LOG_LEVEL || 'info';
const logFormat = process.env.LOG_FORMAT || 'json';

const formats = {
  json: winston.format.json(),
  pretty: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}]: ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    }),
  ),
};

const logger = winston.createLogger({
  level: logLevel,
  format: logFormat === 'json' ? formats.json : formats.pretty,
  defaultMeta: { service: 'aki-bff' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Create logs directory if it doesn't exist (handled by Winston)
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: formats.pretty,
    }),
  );
}

export default logger;
