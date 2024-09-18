import { NEST_APP_OPTIONS } from '@ab/core/app.config';
import { logMiddleware } from '@ab/log/log.middleware';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, NEST_APP_OPTIONS);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3000;

  app.use(logMiddleware);

  const logger = new Logger('0-SystemAPI');
  logger.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  logger.log(
    `Current log level: ${configService.get<string>('LOG_LEVEL')}`,
    'Bootstrap',
  );
  await app.listen(port);
}
bootstrap();
