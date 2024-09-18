import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  wrapContextWithColor,
  wrapMessageWithColor,
  wrapTimestampWithColor,
} from './log-colors.util';

/**
 * LogService implements custom logging with formatted messages.
 */
@Injectable()
export class LogService implements LoggerService {
  private readonly logLevel: LogLevel;

  constructor(private readonly configService: ConfigService) {
    this.logLevel =
      (this.configService.get<string>('LOG_LEVEL') as LogLevel) || 'log';
  }

  error(message: string, context?: string): void {
    this.#formatAndLog('error', message, context);
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
    if (this.#shouldExit(level)) return;

    const timestamp = this.#getFormattedTimestamp();
    const formattedContext = this.#getFormattedContext(level, context);
    const formattedMessage = wrapMessageWithColor(message, level);

    console.log(`${timestamp} ${formattedContext} ${formattedMessage}`);
  }

  #getFormattedTimestamp(): string {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:SS
    return wrapTimestampWithColor(timestamp); // Wrap timestamp with color
  }

  #getFormattedContext(level: LogLevel, context?: string): string {
    return context ? wrapContextWithColor(context, level) : ''; // Wrap context with color
  }

  #shouldExit(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'verbose', 'log', 'warn', 'error'];
    const minLogLevel = levels.indexOf(this.logLevel);
    const levelIndex = levels.indexOf(level);
    const shouldExit = levelIndex < minLogLevel;
    return shouldExit;
  }
}
