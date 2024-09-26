# Add logging to the app

## Context

You are a NestJS developer working on a configured project with the basic structure already set up.

## Goal

- Add a custom logger to the app and make it global.
- Configure it as a middleware to log every request and response.
- Add it as a global filter to log all exceptions.

## Instructions

1. Create a `LogService` in `src/core/log/log.service.ts`:

   - Implement the `LoggerService` interface from `@nestjs/common`.
   - Add methods for different log levels (error, warn, log, debug, verbose).
   - Use `ConfigService` to get the log level from environment variables.

2. Create a `LogModule` in `src/core/log/log.module.ts`:

   - Import `ConfigModule` and register the log configuration.
   - Provide `LogService` as a global service.

3. Create a `log.middleware.ts` in `src/core/log/log.middleware.ts`:

   - Implement a middleware function to log HTTP requests and responses.
   - Use `LogService` to log the details.

4. Create a `log.filter.ts` in `src/core/log/log.filter.ts`:

   - Implement an `ExceptionFilter` to catch and log all exceptions.
   - Use `LogService` to log the exception details.

5. Update `app.module.ts`:

   - Import `LogModule`.
   - Apply the log middleware globally using `configure` method.
   - Add `LogFilter` as a global exception filter.

6. Update `main.ts`:

   - Use `LogService` instead of the default logger when creating the app.

7. Create utility functions in `src/core/log/log-colors.util.ts`:

   - Implement functions to add colors to log output for better readability.

8. Create a log configuration file `src/core/log/log.config.ts`:

   - Define and export log configuration options.

9. Update `.env` `.env.local` and `.env.example` files:

   - Add `LOG_LEVEL` environment variable.

10. Update existing files to use the new `LogService` where appropriate.

Remember to follow the NestJS best practices, use dependency injection, and maintain consistent naming conventions throughout the implementation.
