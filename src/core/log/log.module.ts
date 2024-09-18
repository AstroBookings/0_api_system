import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { logConfig } from './log.config'; // Import log configuration

/**
 * LogModule for managing logging configurations.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [logConfig], // Load log configuration
    }),
  ],
})
export class LogModule {}
