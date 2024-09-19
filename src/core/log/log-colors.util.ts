import { LogLevel } from '@nestjs/common';
import * as chalk from 'chalk';

const COLOR_CODES = {
  serverError: chalk.bgRed,
  clientError: chalk.red,
  serverSuccess: chalk.green,
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  log: chalk.green,
  verbose: chalk.gray,
  debug: chalk.magenta,
  default: chalk.dim,
  dim: chalk.dim,
};

function getColorForStatusCode(statusCode: number): (text: string) => string {
  const category =
    statusCode >= 500
      ? 'serverError'
      : statusCode >= 400
        ? 'clientError'
        : 'serverSuccess';
  return (
    COLOR_CODES[category as keyof typeof COLOR_CODES] || COLOR_CODES.default
  );
}

function getColorForLogLevel(level: LogLevel): (text: string) => string {
  const colorMap: Record<string, (text: string) => string> = {
    error: COLOR_CODES.error,
    warn: COLOR_CODES.warn,
    log: COLOR_CODES.log,
    verbose: COLOR_CODES.verbose,
    debug: COLOR_CODES.debug,
  };
  return colorMap[level as keyof typeof colorMap] || colorMap.default;
}

function wrapWithColor(text: string, color: (text: string) => string): string {
  return color(text); // Apply color to text
}

export function wrapTimestampWithColor(timestamp: string): string {
  return wrapWithColor(timestamp, COLOR_CODES.dim.italic); // Wrap timestamp with dim color
}

export function wrapContextWithColor(context: string, level: LogLevel): string {
  const color = getColorForLogLevel(level); // Get color based on log
  return wrapWithColor(`[${context}]`, color); // Wrap context with its color
}

export function wrapMessageWithColor(message: string, level: LogLevel): string {
  const isLowLevel = level === 'debug' || level === 'verbose';
  if (!isLowLevel) return message; // Return original message if not low level
  return wrapWithColor(message, COLOR_CODES.dim); // Apply dim color to low level message
}

/**
 * Wraps the status code with the corresponding color
 * @param statusCode - The status code to wrap
 * @returns Text with the status code wrapped with the corresponding color
 */
export function wrapStatusWithColor(statusCode: number): string {
  const color = getColorForStatusCode(statusCode); // Get color based on status code
  return wrapWithColor(statusCode.toString(), color); // Wrap status code with the corresponding color
}
