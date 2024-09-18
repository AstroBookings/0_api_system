import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';

@Module({
  controllers: [AuthenticationController],
  providers: [],
})
export class AuthenticationModule {}
