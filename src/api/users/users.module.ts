import { TokenModule } from '@ab/token/token.module';
import { TokenService } from '@ab/token/token.service';
import { Module } from '@nestjs/common';
import { UsersInMemoryRepository } from './users-in-memory.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

/**
 * Module for the authentication endpoints
 */
@Module({
  imports: [TokenModule],
  controllers: [UsersController],
  providers: [
    TokenService,
    UsersService,
    {
      provide: UsersRepository,
      useClass: UsersInMemoryRepository,
    },
  ],
})
export class UsersModule {}
