# Reset NestJS app

## Context

You are working on a brand new NestJS project.

## Goal

Follow these instructions to reset the app to a more production-ready state.

## Instructions

1. Remove default controller and service with their spec files.

   - Remove files:
     - app.controller.spec.ts
     - app.controller.ts
     - app.service.spec.ts
     - app.service.ts
   - Update `AppModule` imports: remove `AppController`, `AppService`

2. Create main folders with the following structure:

```text
src/
  api/
  core/
    log/
  shared/
    auth/
    token/
    utils/
```

5. Generate alias for the new folders.
   - Add them to `tsconfig.json` as paths, using the prefix `@ab`.
     > Example:

```json
"paths": {
      "@ab/api/*": ["src/api/*"],
      "@ab/log/*": ["src/core/log/*"],
      "@ab/auth/*": ["src/shared/auth/*"],
      "@ab/token/*": ["src/shared/token/*"],
      "@ab/utils/*": ["src/shared/utils/*"],
      "@ab/*": ["src/*"]
    }
```

- Add them to `package.json` and `test/jest-e2e.json` as jest moduleNameMapper.
  > Example:

```json
"moduleNameMapper": {
      "^@ab/api/(.*)$": "<rootDir>/api/$1",
      "^@ab/log/(.*)$": "<rootDir>/core/log/$1",
      "^@ab/auth/(.*)$": "<rootDir>/shared/auth/$1",
      "^@ab/token/(.*)$": "<rootDir>/shared/token/$1",
      "^@ab/utils/(.*)$": "<rootDir>/shared/utils/$1",
      "^@ab/(.*)$": "<rootDir>/$1"
    }
```
