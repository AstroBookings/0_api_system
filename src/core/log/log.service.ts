import { cleanText } from '@ab/utils/text-cleaner.util';
import { Injectable, LoggerService, LogLevel, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  wrapContextWithColor,
  wrapMessageWithColor,
  wrapTimestampWithColor,
} from './log-colors.util';

/**
 * Custom logging implementation of the LoggerService interface
 * @description To be used in the main.ts file during the app bootstrap
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LogService implements LoggerService {
  private readonly logLevel: LogLevel;

  constructor(private readonly configService: ConfigService) {
    this.logLevel = this.configService.get<string>('LOG_LEVEL') as LogLevel;
    this.log(`Initialized with log level: ${this.logLevel}`, 'LogService');
  }

  error(message: string, context?: string): void {
    this.#formatAndLog('error', message, context);
    const currentStack = new Error().stack;
    this.debug(`currentStack: ${currentStack}`, 'LogService');
  }
  warn(message: string, context?: string): void {
    this.#formatAndLog('warn', message, context);
  }

  log(message: string, context?: string): void {
    this.#formatAndLog('log', message, context);
  }

  debug(message: string, context?: string): void {
    this.#formatAndLog('debug', message, context);
  }

  verbose(message: string, context?: string): void {
    this.#formatAndLog('verbose', message, context);
  }

  #formatAndLog(level: LogLevel, message: string, context?: string): void {
    if (this.#shouldSkip(level)) return;
    const cleanContext = context ? cleanText(context) : 'Unknown';
    const formattedContext = wrapContextWithColor(level, cleanContext);
    const formattedTimestamp = wrapTimestampWithColor(this.#getTimestamp());
    const formattedMessage = wrapMessageWithColor(message, level);

    console.log(`${formattedTimestamp} ${formattedContext} ${formattedMessage}`);
  }

  #getTimestamp(): string {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:SS
    return timestamp;
  }

  #shouldSkip(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'verbose', 'log', 'warn', 'error'];
    const minLogLevel = levels.indexOf(this.logLevel);
    const levelIndex = levels.indexOf(level);
    const shouldSkip = levelIndex < minLogLevel;
    return shouldSkip;
  }
}
