# Application configuration

## Context

You are a NestJS developer working on reset clean project.

## Goal

Follow these instructions to configure the app.

## Instructions

1. Install `@nestjs/config` package.
2. Create a `src/core/config/config.util.ts` file with the following content:

```typescript
export const envFilePath = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';

export type AppConfig = {
  host: string;
  port: number;
  appName: string;
  appTitle: string;
  appDescription: string;
};

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
```

3. Configure `AppModule` to use `ConfigModule`

```typescript
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: envFilePath,
    isGlobal: true,
    cache: true,
  })],
})
```

4. Create at root level the `.env` and `.env.local` and `.env.example` files with the following content:

```bash
# Example environment variables
NODE_ENV=development
# App
APP_HOST=http://localhost
APP_PORT=3000
APP_NAME=0_SystemAPI
APP_TITLE=🚀 AstroBookings 👔 System API
APP_DESCRIPTION=The API to authentication and monitor the system.
# Log
LOG_LEVEL=verbose
# JWT
JWT_SECRET=secret
JWT_EXPIRES_IN=1d
# API KEY
API_KEY=secret
```

5. Use `AppConfig.port` in `main.ts` to set the port for the app.

```typescript
const appConfig: AppConfig = getAppConfig(app);
await app.listen(appConfig.port);
```
