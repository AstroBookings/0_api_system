import { convertToKB } from '@ab/utils/size-converter.util';
import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Function middleware to log the request and response
 * @param req - The Request being processed
 * @param res - The Response being issued
 * @param next - The NextFunction to call to continue processing
 */
export function logMiddleware(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const statusCode: number = res.statusCode;
    // ToDo: refactor this in a function
    const category =
      statusCode >= 500
        ? 'serverError'
        : statusCode >= 400
          ? 'clientError'
          : 'success';
    const colorMap: Record<string, string> = {
      serverError: '\x1B[31m', // red
      clientError: '\x1B[33m', // yellow
      success: '\x1B[32m', // green
      default: '\x1B[36m', // cyan
    };
    const color =
      colorMap[category as keyof typeof colorMap] || colorMap.default;

    const statusCodeChunk = `${color}${statusCode}\x1B[0m`;
    const contentLength: number = parseInt(res.get('content-length') || '0');
    const contentKb = convertToKB(contentLength);
    const message = `${method} ${originalUrl} ${statusCodeChunk} ${contentKb}`;
    new Logger('HTTP').log(message);
  });

  next();
}
