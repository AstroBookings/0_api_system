import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { logConfig } from './log.config'; // Import log configuration

/**
 * Configuration module for the logging system
 * @description Responsible for configuring the logging system.
 * @requires ConfigModule to load the configuration from the environment variables.
 */
@Module({
  imports: [ConfigModule.forFeature(logConfig)],
})
export class LogModule {}
