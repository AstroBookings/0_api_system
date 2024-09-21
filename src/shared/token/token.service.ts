import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './token-payload.type';
/**
 * Service that provides methods to generate and validate JWT tokens.
 * @remarks JwtService is used to sign and verify the tokens.
 */
@Injectable()
export class TokenService {
  readonly #logger = new Logger(TokenService.name);

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT token for the given user.
   * @param sub - The subject of the token.
   * @returns The generated JWT token.
   */
  public async generateToken(sub: string): Promise<string> {
    const token = await this.jwtService.signAsync({ sub });
    return token;
  }

  /**
   * Validates a JWT token and returns the decoded user information.
   * @param token - The JWT token to validate.
   * @returns The decoded payload information.
   */
  public async validateToken(token: string): Promise<TokenPayload> {
    try {
      const decoded: TokenPayload = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch (error) {
      this.#logger.verbose('Invalid token', token);
      throw new UnauthorizedException(error);
    }
  }

  /**
   * Decodes a JWT token.
   * @param token - The token to decode.
   * @returns The decoded token payload.
   */
  public decodeToken(token: string): TokenPayload {
    try {
      return this.jwtService.decode(token) as TokenPayload;
    } catch (error) {
      this.#logger.verbose('Invalid token', token);
      throw new UnauthorizedException(error);
    }
  }
}
