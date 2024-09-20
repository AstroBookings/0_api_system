# Add logging to the app

## Context

You are working in a brand new NestJS project, with configuration already set up.

## Goal

Add a custom logger to the app and make it global.
Configure it as a middleware to log every request and response.
Add it as a global filter to log all exceptions.

## Instructions

1. Create a `LogModule` at `core/log` folder
   1. Import the `ConfigModule.forFeature('logConfig')` at the `LogModule`
   2. Import the `LogModule` at `AppModule`
2. Create a `LogService` that implements `LoggerService`
   1. Add `ConfigService` as constructor argument to the `LogService`
   2. Exit without logging when the log level is negligible.
   3. Format message using a timestampChunk, contextChunk, and messageChunk
      1. The timestamp should be _HH:MM:SS_ and dim italic
      2. The context should be in square brackets and red bold for errors, yellow bold for warnings, green bold for logs, gray for verbose and magenta for debug
      3. The message for low level (verbose and debug) logs should be in dim, otherwise reset
3. Configure the logger at main.ts
   1. Add logger: `new LogService(new ConfigService())` to the NestFactory at main.ts
   2. Can take this instruction into a factory function at `log.factory.ts`
   3. Use the logger at main.ts to log the port number and log level at the start of the app
4. Add log middleware to the app
   1. Log the status code and method and url for each request
   2. Log the exception and stack trace if an error occurs
   3. Add the log middleware at main.ts
5. Add a filter that catches and logs all exceptions thrown in the application.
   1. Add the filter at main.ts
6. Instance the logger at any class using `new Logger(MyClass.name);`
