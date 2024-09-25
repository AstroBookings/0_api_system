import { LogLevel } from '@nestjs/common';
import * as chalk from 'chalk';

/**
 * Defines color codes for different log categories.
 * Maps categories to specific chalk styling functions.
 */
const COLOR_CODES = {
  serverError: chalk.redBright,
  clientError: chalk.red,
  serverSuccess: chalk.greenBright,

  error: chalk.redBright.bold,
  warn: chalk.red,

  log: chalk.blue,

  verbose: chalk.cyan,
  debug: chalk.magenta,

  default: chalk.dim,
  dim: chalk.dim,
};

/**
 * Determines the appropriate color function based on the HTTP status code.
 *
 * @param statusCode - The HTTP status code of the response.
 * @returns A function that applies the determined color to a given text.
 */
function getColorForStatusCode(statusCode: number): (text: string) => string {
  const category =
    statusCode >= 500 ? 'serverError' : statusCode >= 400 ? 'clientError' : 'serverSuccess';
  return COLOR_CODES[category as keyof typeof COLOR_CODES] || COLOR_CODES.default;
}

/**
 * Determines the appropriate color function based on the log level.
 *
 * @param level - The log level from NestJS.
 * @returns A function that applies the determined color to a given text.
 */
function getColorForLogLevel(level: LogLevel): (text: string) => string {
  const colorMap: Record<string, (text: string) => string> = {
    error: COLOR_CODES.error,
    warn: COLOR_CODES.warn,
    log: COLOR_CODES.log,
    verbose: COLOR_CODES.verbose,
    debug: COLOR_CODES.debug,
  };
  return colorMap[level as keyof typeof colorMap] || COLOR_CODES.default;
}

/**
 * Applies a color function to wrap the given text.
 *
 * @param text - The text to be colored.
 * @param color - The color function to apply.
 * @returns The colored text.
 */
function wrapWithColor(text: string, color: (text: string) => string): string {
  return color(text);
}

/**
 * Wraps the timestamp with a dim and italic style for consistent logging.
 *
 * @param timestamp - The timestamp string to be styled.
 * @returns The styled timestamp.
 */
export function wrapTimestampWithColor(timestamp: string): string {
  return wrapWithColor(timestamp, COLOR_CODES.dim.italic);
}

/**
 * Wraps the context string with the appropriate color based on log level.
 *
 * @param level - The log level to determine styling.
 * @param context - The context or source of the log.
 * @returns The styled context string.
 */
export function wrapContextWithColor(level: LogLevel, context: string): string {
  const color = getColorForLogLevel(level);
  return wrapWithColor(`[${context}]`, color);
}

/**
 * Wraps the log message with color based on its log level.
 * High-level logs are left unchanged, while others are dimmed.
 *
 * @param message - The log message to be styled.
 * @param level - The log level to determine styling.
 * @returns The styled or original message.
 */
export function wrapMessageWithColor(message: string, level: LogLevel): string {
  const isHighLevel = ['log', 'warn', 'error'].includes(level);
  if (isHighLevel) return message;
  return wrapWithColor(message, COLOR_CODES.dim);
}

/**
 * Wraps the HTTP status code with a color based on its category.
 *
 * @param statusCode - The HTTP status code to be styled.
 * @returns The styled status code as a string.
 */
export function wrapStatusWithColor(statusCode: number): string {
  const color = getColorForStatusCode(statusCode);
  return wrapWithColor(statusCode.toString(), color);
}
