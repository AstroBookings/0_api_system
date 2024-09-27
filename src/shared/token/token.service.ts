import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './token-payload.type';
/**
 * Service that provides methods to generate and validate JWT tokens.
 * @requires JwtService to sign and verify the tokens.
 */
@Injectable()
export class TokenService {
  readonly #logger = new Logger(TokenService.name);

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT token for the given subject.
   * @param sub - The subject of the token (e.g. user ID)
   * @returns The generated JWT token.
   */
  async generateToken(sub: string): Promise<string> {
    const token = await this.jwtService.signAsync({ sub });
    return token;
  }

  /**
   * Validates a JWT token and returns the decoded information.
   * @param token - The JWT token to validate.
   * @returns The decoded payload information.
   */
  async validateToken(token: string): Promise<TokenPayload> {
    try {
      const decoded: TokenPayload = await this.jwtService.verifyAsync(token);
      this.#logger.verbose('Valid token', decoded);
      return decoded;
    } catch (error) {
      this.#logger.verbose('Invalid token', error);
      throw new UnauthorizedException(error.message);
    }
  }
}
