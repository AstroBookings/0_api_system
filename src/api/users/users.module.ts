import { MongoRepository } from '@ab/shared/data/mongo.repository';
import { TokenModule } from '@ab/token/token.module';
import { Module } from '@nestjs/common';
import { UsersMongoRepository } from './users-mongo.repository';
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
    MongoRepository,
    {
      provide: UsersRepository,
      useClass: UsersMongoRepository,
    },
  ],
})
export class UsersModule {}
