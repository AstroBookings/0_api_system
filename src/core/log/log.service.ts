import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * LogService implements custom logging with formatted messages.
 */
@Injectable()
export class LogService implements LoggerService {
  private readonly logLevel: string;

  constructor(private readonly configService: ConfigService) {
    this.logLevel = this.configService.get<string>('LOG_LEVEL') || 'log';
  }

  log(message: string, context?: string): void {
    this.formatAndLog('log', message, context);
  }

  error(message: string, context?: string): void {
    this.formatAndLog('error', message, context);
  }

  warn(message: string, context?: string): void {
    this.formatAndLog('warn', message, context);
  }

  private formatAndLog(level: string, message: string, context?: string): void {
    const timestamp = this.getFormattedTimestamp();
    const formattedContext = this.getFormattedContext(level, context);
    const formattedMessage = this.getFormattedMessage(level, message);

    if (this.shouldLog(level)) {
      console.log(`${timestamp} ${formattedContext} ${formattedMessage}`);
    }
  }

  private getFormattedTimestamp(): string {
    const now = new Date();
    return `\x1B[2m${now.toTimeString().split(' ')[0]}\x1B[0m`; // HH:MM:SS in dim italic
  }

  private getFormattedContext(level: string, context?: string): string {
    const colorMap: Record<string, string> = {
      // Use Record to define the type
      error: '\x1B[31m', // red
      warn: '\x1B[33m', // yellow
      log: '\x1B[32m', // green
      default: '\x1B[36m', // cyan
    };
    const color = colorMap[level as keyof typeof colorMap] || colorMap.default; // Cast level to keyof
    return context ? `${color}[${context}]\x1B[0m` : '';
  }

  private getFormattedMessage(level: string, message: string): string {
    const isLowLevel = level === 'log' && this.logLevel === 'info';
    return isLowLevel ? `\x1B[2m${message}\x1B[0m` : message; // dim for low level
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'log', 'debug', 'verbose'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }
}
