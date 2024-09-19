import {
  AppConfig,
  documentationBuilder,
  getAppConfig,
  validationPipeOptions,
} from '@ab/core/app-bootstrap.util';
import { logMiddleware } from '@ab/log/log.middleware';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from './core/log/log.factory';
import { LogFilter } from './core/log/log.filter';

/**
 * Bootstrap the application
 * @description This is the entry point of the application
 */
async function bootstrap() {
  const logger = createLogger();
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger,
  });
  const appConfig: AppConfig = getAppConfig(app);
  app.use(logMiddleware);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new LogFilter());
  documentationBuilder(app, appConfig, logger);
  logger.log(`🚀 ${appConfig.host}:${appConfig.port}/api`, 'Bootstrap');
  await app.listen(appConfig.port);
}
bootstrap();
