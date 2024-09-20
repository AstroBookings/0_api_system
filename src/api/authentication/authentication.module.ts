import { TokenModule } from '@ab/shared/token/token.module';
import { TokenService } from '@ab/shared/token/token.service';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './providers/authentication.service';
import { InMemoryUserRepository, UserRepository } from './providers/user.repository';

/**
 * Module for the authentication endpoints
 */
@Module({
  imports: [TokenModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
    TokenService,
  ],
})
export class AuthenticationModule {}
