import { registerAs } from '@nestjs/config';

/**
 * Log configuration settings.
 */
export const logConfig = registerAs('log', () => ({
  level: process.env.LOG_LEVEL || 'log',
}));
