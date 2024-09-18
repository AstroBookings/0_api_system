# Add logging to the app

1. Create a LogModule at core/log
2. Import the ConfigModule for feature logConfig
3. Import the LogModule at AppModule
4. Create a LogService that implements LoggerService
5. Add ConfigService as construtor argument to the LogService
6. Exit without logging when the log level is negligible.
7. format message using a timestampChunk, contextChunk, and messageChunk
8. The timestamp should be HH:MM:SS and dim italic
9. The context should be in square brackets and red for errors, yellow for warnings, green for logs and cyan for others
10. The message for low level logs should be in dim , otherwise reset
11. Add logger: new LogService(new ConfigService()), to the AppConfig at core/app.config.ts
12. Use the logger at main.ts to log the port number and log level at the start of the app
13. Add LOG_LEVEL=debug to the all env files
