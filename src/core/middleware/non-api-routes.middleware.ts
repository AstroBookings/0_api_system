import { NextFunction, Request, Response } from 'express';

const ALLOWED_PREFIXES = ['/api/', '/docs/'];

/**
 * Middleware function to handle non-API routes
 * @description This middleware returns a 204 status code for routes that don't start with allowed prefixes.
 * It's configured in the AppModule to be applied globally to all routes.
 * @param req - The incoming HTTP request
 * @param res - The outgoing HTTP response
 * @param next - The next middleware function in the chain
 */
export function nonApiRoutesMiddleware(req: Request, res: Response, next: NextFunction) {
  const { originalUrl } = req;
  const isAllowedPath = ALLOWED_PREFIXES.some((prefix) => originalUrl.includes(prefix));
  if (!isAllowedPath) {
    return res.status(204).send();
  }
  next();
}
