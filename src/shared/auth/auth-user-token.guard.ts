import { TokenService } from '@ab/token/token.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
/**
 * Guard that checks if the request has a valid user token in the Authorization header.
 * @requires TokenService to validate the token.
 */
@Injectable()
export class AuthUserTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  /**
   * Checks if the request has a valid user token in the Authorization header.
   * @param context - The execution context of the request.
   * @returns A promise that resolves to a boolean indicating whether the request is authorized.
   * @throws UnauthorizedException if the token is missing or invalid.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.tokenService.validateToken(token);
      const userId = payload.sub;
      request.userId = userId;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
