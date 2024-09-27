import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

/**
 * JWT configuration factory function.
 * @param configService - The ConfigService instance.
 * @returns The JWT configuration object.
 */
function jwtConfigFactory(configService: ConfigService) {
  const secret = configService.get<string>('JWT_SECRET');
  const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
  return {
    global: true,
    secret,
    signOptions: { expiresIn },
  };
}

/**
 * TokenModule provides JWT token creation, validation, and decoding functionality.
 * It configures the JwtModule with the necessary settings and exports TokenService.
 * @requires ConfigService to get the JWT_SECRET and JWT_EXPIRES_IN from the environment variables.
 * @requires JwtModule to sign and verify the tokens.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtConfigFactory,
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
