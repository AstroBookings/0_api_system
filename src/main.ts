import { logMiddleware } from '@ab/log/log.middleware';
import { LogService } from '@ab/log/log.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { documentationBuilder, validationPipeOptions } from './core/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new LogService(new ConfigService()),
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3000;
  const logger = new Logger('0-SystemAPI');
  logger.verbose(
    `Current log minimum level: ${configService.get<string>('LOG_LEVEL')}`,
    'Bootstrap',
  );
  app.use(logMiddleware);
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  documentationBuilder(app);
  logger.log(
    `Documentation available at: http://localhost:${port}/docs`,
    'Bootstrap',
  );
  logger.log(
    `Application is running on: http://localhost:${port}/api`,
    'Bootstrap',
  );
  await app.listen(port);
}
bootstrap();
