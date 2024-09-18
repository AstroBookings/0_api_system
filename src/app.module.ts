import { CONFIG_OPTIONS } from '@ab/core/app.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './api/admin/admin.module';
import { LogModule } from './core/log/log.module';

const configModule = ConfigModule.forRoot(CONFIG_OPTIONS);
const coreModules = [LogModule];
const apiModules = [AdminModule];

@Module({
  imports: [configModule, ...coreModules, ...apiModules],
})
export class AppModule {}
