import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { logConfig } from './log.config'; // Import log configuration

/**
 * Configuration module for the logging system
 * @description This module is responsible for configuring the logging system. It uses the ConfigModule to load the configuration from the environment variables.
 */
@Module({
  imports: [ConfigModule.forFeature(logConfig)],
})
export class LogModule {}
