import { ConfigService } from '@nestjs/config';
import { LogService } from './log.service';

export const createLogger = () => new LogService(new ConfigService());
