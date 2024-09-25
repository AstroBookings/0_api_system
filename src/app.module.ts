import { UsersModule } from '@ab/api/users/users.module';
import { envFilePath, validationPipeOptions } from '@ab/app-bootstrap.util';
import { LogFilter } from '@ab/log/log.filter';
import { logMiddleware } from '@ab/log/log.middleware';
import { LogModule } from '@ab/log/log.module';
import { Logger, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';

const CONFIG_OPTIONS = {
  envFilePath,
  isGlobal: true,
  cache: true,
};

const configModule = ConfigModule.forRoot(CONFIG_OPTIONS);
const coreModules = [LogModule];
const apiModules = [UsersModule];

/**
 * The root module of the application.
 * @description Imports core and API modules.
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logMiddleware).forRoutes('*');
    new Logger('AppModule').log('AppModule initialized');
  }
}
