import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
/**
 * Guard that checks if the request has a valid API key in the header.
 * @description It uses the ConfigService to get the API key from the environment variables.
 */
@Injectable()
export class AuthApiKeyGuard implements CanActivate {
  readonly #logger = new Logger(AuthApiKeyGuard.name);

  constructor(private configService: ConfigService) {}

  /**
   * Checks if the request has a valid API key in the header.
   * @param context - The execution context of the request.
   * @returns A boolean indicating whether the request is authorized.
   * @throws UnauthorizedException if the API key is missing or invalid.
   */
  canActivate(context: ExecutionContext): boolean {
    const validApiKey = this.configService.get<string>('API_KEY');

    if (!validApiKey) {
      this.#logger.warn('API_KEY is not configured in the environment');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('X-API-Key');

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    if (apiKey !== validApiKey) {
      this.#logger.debug('Invalid API Key', apiKey, validApiKey);
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
