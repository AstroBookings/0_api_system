import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

/**
 * Configuration factory for JWT settings.
 * Retrieves JWT secret and expiration time from environment variables.
 */
const jwtConfig = registerAs('jwt', () => ({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
}));

/**
 * TokenModule provides JWT token creation, validation, and decoding functionality.
 * It configures the JwtModule with the necessary settings and exports TokenService.
 * @requires ConfigModule to get the JWT secret and expiration time from environment variables.
 * @requires JwtModule to sign and verify the tokens.
 */
@Module({
  imports: [ConfigModule.forFeature(jwtConfig), JwtModule.registerAsync(jwtConfig.asProvider())],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
