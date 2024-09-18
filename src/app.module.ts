import { CONFIG_OPTIONS } from '@ab/core/app.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './api/admin/admin.module';
import { LogModule } from './core/log/log.module';

@Module({
  imports: [ConfigModule.forRoot(CONFIG_OPTIONS), LogModule, AdminModule],
})
export class AppModule {}
