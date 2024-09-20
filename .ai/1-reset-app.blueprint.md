## Reset NestJS app

## Context

You are working in a brand new NestJS project.

Read this instruction and reset the app to a more production-ready state.

## Goal

Configure the app to a more production-ready state.

## ResetInstructions

1. Add rule `endOfLine` auto to `.eslintrc.js`:
2. Remove app controller and service with their spec files.
   - Remove files:
     - app.controller.spec.ts
     - app.controller.ts
     - app.service.spec.ts
     - app.service.ts
   - Update `AppModule` imports: remove `AppController`, `AppService`
3. Add cls script to `package.json` and call it before all start and test executions. Do not add any comments. Respect JSON and npm syntax.
4. Create main folders

```
src/
  api/
  core/
    log/
  shared/
    token/
    utils/
```

5. Add them to `tsconfig.json` as paths, using the prefix `@ab`.
6. Add them to `package.json` as jest moduleNameMapper.
7. Add them to `test/jest-e2e.json` as jest moduleNameMapper.

## Application configuration

1. Install `@nestjs/config` package.
2. Generate a `src/core/app.bootstrap.util.ts` file with the following content:

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

3. Configure `AppModule` to use `ConfigModule` with `CONFIG_OPTIONS`.
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
```

5. Use `AppConfig.port` in `main.ts` to set the port for the app.
