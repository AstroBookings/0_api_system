import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getAppConfig } from './core/config/config.util';

/**
 * Builds and sets up Swagger(OpenAPI) documentation for the application.
 *
 * @param app - The NestJS application instance.
 */
export const buildSwaggerDocumentation = (app: INestApplication) => {
  const appConfig = getAppConfig(app);
  const openApiConfig = new DocumentBuilder()
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API Key for the application',
      },
      'apiKey',
    )
    .setTitle(appConfig.appTitle)
    .setDescription(appConfig.appDescription)
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);
  const path = 'docs';
  SwaggerModule.setup(path, app, openApiDocument);
};
