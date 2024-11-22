import { MongoRepository } from '@ab/shared/data/mongo.repository';
import { TokenModule } from '@ab/token/token.module';
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
    UsersService,
    {
      provide: UsersRepository,
      useClass: UsersInMemoryRepository,
    },
    MongoRepository,
  ],
})
export class UsersModule {}
