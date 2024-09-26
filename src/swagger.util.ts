import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getAppConfig } from './core/config/config.util';

/**
 * Builds and sets up Swagger documentation for the application.
 *
 * @param app - The NestJS application instance.
 */
export const buildSwaggerDocumentation = (app: INestApplication) => {
  const appConfig = getAppConfig(app);
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(appConfig.appTitle)
    .setDescription(appConfig.appDescription)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
