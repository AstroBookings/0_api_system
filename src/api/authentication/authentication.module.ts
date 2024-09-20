import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './providers/authentication.service';
import {
  InMemoryUserRepository,
  UserRepository,
} from './providers/user.repository';

/**
 * Module for the authentication endpoints
 */
@Module({
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
  ],
})
export class AuthenticationModule {}
