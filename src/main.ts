import { NestFactory } from '@nestjs/core';
import { AppConfig, buildSwaggerDocumentation, getAppConfig } from './app-bootstrap.util';
import { AppModule } from './app.module';
import { createLogger } from './core/log/log.factory';

/**
 * Bootstrap the application
 * @description This is the entry point of the application
 */
async function bootstrap() {
  const logger = createLogger();
  const app = await NestFactory.create(AppModule, { cors: true, logger });
  buildSwaggerDocumentation(app);
  const appConfig: AppConfig = getAppConfig(app);
  logger.log(`📚 ${appConfig.host}:${appConfig.port}/docs`, 'Bootstrap');
  logger.log(`🚀 ${appConfig.host}:${appConfig.port}/api`, 'Bootstrap');
  await app.listen(appConfig.port);
}
bootstrap();
