import { TokenModule } from '@ab/shared/token/token.module';
import { TokenService } from '@ab/shared/token/token.service';
import { Module } from '@nestjs/common';
import { InMemoryUsersRepository, UsersRepository } from './providers/users.repository';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';

/**
 * Module for the authentication endpoints
 */
@Module({
  imports: [TokenModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: InMemoryUsersRepository,
    },
    TokenService,
  ],
})
export class UsersModule {}
