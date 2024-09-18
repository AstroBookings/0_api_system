import {
  HttpStatus,
  INestApplication,
  ValidationPipeOptions,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.local';

/**
 * Main configuration to be used in AppModule
 */
export const CONFIG_OPTIONS = {
  envFilePath,
  isGlobal: true,
  cache: true,
};
/**
 * Build the documentation for the API
 * @param app The NestJS application
 */
export const documentationBuilder = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('🚀 AstroBookings 👔 System API')
    .setDescription('The API to authentication and monitor the system.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};

/**
 * Validation pipe options
 */
export const validationPipeOptions: ValidationPipeOptions = {
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  forbidNonWhitelisted: true,
  transform: true,
};
