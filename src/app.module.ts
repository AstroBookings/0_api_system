import { UsersModule } from '@ab/api/users/users.module';
import { envFilePath } from '@ab/config/config.util';
import { LogFilter } from '@ab/log/log.filter';
import { logMiddleware } from '@ab/log/log.middleware';
import { LogModule } from '@ab/log/log.module';
import {
  HttpStatus,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
/**
 * Configuration options for the ConfigModule
 */
const CONFIG_OPTIONS = {
  envFilePath,
  isGlobal: true,
  cache: true,
};

/**
 * Instantiate the ConfigModule with the defined options
 */
const configModule = ConfigModule.forRoot(CONFIG_OPTIONS);

/**
 * Array of core modules to be imported
 */
const coreModules = [LogModule];

/**
 * Array of API modules to be imported
 */
const apiModules = [UsersModule];

/**
 * Configuration options for the global validation pipe.
 */
const validationPipeOptions: ValidationPipeOptions = {
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  forbidNonWhitelisted: true,
  transform: true,
};
/**
 * The root module of the application.
 * @description Imports core and API modules, sets up global pipes and filters.
 */
@Module({
  imports: [configModule, ...coreModules, ...apiModules],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(validationPipeOptions),
    },
    {
      provide: APP_FILTER,
      useClass: LogFilter,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Configure global middleware
   * @param consumer - The MiddlewareConsumer to apply middleware
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logMiddleware).forRoutes('*');
    new Logger('AppModule').log('AppModule initialized');
  }
}
