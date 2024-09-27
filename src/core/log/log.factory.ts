import { ConfigService } from '@nestjs/config';
import { LogService } from './log.service';

/**
 * Creates a new instance of the LogService.
 * @remarks This is used in the main.ts file to create a new instance of the LogService.
 * @requires ConfigService to get the log level from the environment variables
 * @returns A new instance of the LogService
 */
export const createLogger = () => new LogService(new ConfigService());
