import { convertToKB } from '@ab/utils/size-converter.util';
import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { wrapStatusWithColor } from './log-colors.util';

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
    const statusCodeChunk = wrapStatusWithColor(statusCode);
    const contentLength: number = parseInt(res.get('content-length') || '0');
    const contentKb = convertToKB(contentLength);
    const message = `${method} ${originalUrl} ${statusCodeChunk} ${contentKb}`;
    new Logger('HTTP').verbose(message);
  });

  next();
}
