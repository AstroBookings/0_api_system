import { CONFIG_OPTIONS } from '@ab/core/app.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(CONFIG_OPTIONS), // Configure ConfigModule with APP_OPTIONS
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
