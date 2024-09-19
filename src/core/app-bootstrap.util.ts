import {
  HttpStatus,
  INestApplication,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogService } from './log/log.service';

/**
 * Build the documentation for the API
 * @param app The NestJS application
 */
export const documentationBuilder = (
  app: INestApplication,
  appConfig: AppConfig,
  logger: LogService,
) => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(appConfig.appTitle)
    .setDescription(appConfig.appDescription)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  logger.log(`📚 ${appConfig.host}:${appConfig.port}/docs`, 'Bootstrap');
};

/**
 * Validation pipe options
 */
export const validationPipeOptions: ValidationPipeOptions = {
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  forbidNonWhitelisted: true,
  transform: true,
};

/**
 * Get the app configuration
 * @param app The NestJS application
 * @returns The app configuration
 */
export function getAppConfig(app: INestApplication): AppConfig {
  const configService = app.get(ConfigService);
  return {
    host: configService.get<string>('APP_HOST') || 'localhost',
    port: configService.get<number>('APP_PORT') || 3000,
    appName: configService.get<string>('APP_NAME') || 'API',
    appTitle: configService.get<string>('APP_TITLE') || 'A.P.I.',
    appDescription: configService.get<string>('APP_DESCRIPTION') || 'The API.',
  };
}
/**
 * App configuration interface
 */
export type AppConfig = {
  host: string;
  port: number;
  appName: string;
  appTitle: string;
  appDescription: string;
};
