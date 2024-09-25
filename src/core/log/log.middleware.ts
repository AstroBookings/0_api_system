import { convertToKB } from '@ab/utils/size-converter.util';
import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { wrapStatusWithColor } from './log-colors.util';

/**
 * Middleware function to log HTTP requests and responses
 * @description This middleware logs details of incoming HTTP requests and outgoing responses.
 * It's configured in the AppModule to be applied globally to all routes.
 * The log includes method, URL, status code, and response size.
 * @param req - The incoming HTTP request
 * @param res - The outgoing HTTP response
 * @param next - The next middleware function in the chain
 */
export function logMiddleware(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl } = req;
  // Log the request on the finish event of the response
  res.on('finish', () => {
    const statusCode: number = res.statusCode;
    const statusCodeText = wrapStatusWithColor(statusCode);
    const contentLength: number = parseInt(res.get('content-length') || '0');
    const contentKbText = convertToKB(contentLength);
    const message = `${method} ${originalUrl} ${statusCodeText} ${contentKbText}`;
    new Logger('HTTP').verbose(message);
  });

  // Continue to the next middleware
  next();
}
