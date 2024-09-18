## Reset nestjs app

You are a senior NestJS developer. You are tasked with resetting a NestJS app.

## Context

You are working in a brand new NestJS project.
Read this instruction and reset the app to a more production-ready state.

## Goal

Configure the app to a more production-ready state.

## ResetInstructions

1. Add rule `endOfLine` auto to `.eslintrc.js`:
2. Remove app controller and service with their spec files.
   - Remove files: @ab/api/app.controller.spec.ts, @ab/api/app.controller.ts, @ab/api/app.service.spec.ts, @ab/api/app.service.ts
   - Remove from `AppModule` imports: `AppController`, `AppService`
3. Add cls script to @package.json and call it before all start and test executions. Do not add any comments. Respect JSON and npm syntax.
4. Crete main folders

```
src/
  api/
  core/
    log/
  shared/
    auth/
    utils/
```

5. Add them to @tsconfig.json as paths, using the prefix `@ab`.
6. Add them to @package.json as jest moduleNameMapper.
7. Add them to @test/jest-e2e.json as jest moduleNameMapper.

## Application configuration

1. Install `@nestjs/config` package.
2. Generate a `src/core/app.config.ts` file with the following content:

```typescript
const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
/**
 * Main configuration
 */
export const CONFIG_OPTIONS = {
  envFilePath,
  isGlobal: true,
  cache: true,
};
/**
 * Nest app options
 */
export const NEST_APP_OPTIONS = {
  cors: true,
};
```

3. Configure `AppModule` to use `ConfigModule` with `CONFIG_OPTIONS`.
4. Create `.env` and `.env.local` and `.env.example` files with the following content:

```
NODE_ENV=development
APP_PORT=3000
```

5. Use `APP_PORT` in `main.ts` to set the port for the app.

6. Use `NEST_APP_OPTIONS` to configure nest app options in `main.ts`.
