import * as winston from 'winston';
import { env } from '../config/env';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which transports the logger must use
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    level: 'http', // Explicitly set console level to show HTTP logs
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => {
          const message = info.message;
          const metadata = info[Symbol.for('splat')] as any[] || [];
          const hasMetadata = Array.isArray(metadata) && metadata.length > 0 && typeof metadata[0] === 'object';
          
          if (hasMetadata) {
            return `${info['timestamp']} ${info.level}: ${message} ${JSON.stringify(metadata[0], null, 2)}`;
          }
          return `${info['timestamp']} ${info.level}: ${message}`;
        },
      ),
    ),
  }),
];

// Add file transports only in development
if (env.NODE_ENV === 'development') {
  // File transport for errors
  transports.push(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }));
  
  // File transport for all logs
  transports.push(new winston.transports.File({
    filename: 'logs/combined.log',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }));
}

// Create the logger
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels,
  transports,
  exitOnError: false,
});

// Create logs directory if it doesn't exist (only in development)
if (env.NODE_ENV === 'development') {
  const { mkdirSync } = require('fs');
  try {
    mkdirSync('logs', { recursive: true });
  } catch (_error) {
    // Directory already exists or other error
  }
}