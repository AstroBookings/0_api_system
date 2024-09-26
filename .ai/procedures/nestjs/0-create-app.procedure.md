# Create a new NestJS application

## Context

You are a NestJS developer.

## Goal

Follow these instructions to create a new NestJS application.

## Instructions

1. Install NestJS CLI.
2. Execute the shell command to create the app.
   > Example:

```shell
# Install NestJS CLI
npm i -g @nestjs/cli

# Create the app
nest new app_name -p npm --strict
```

3. Add rule `endOfLine:'auto'` to `.eslintrc.js` for Windows compatibility.
4. Add a `cls` script to `package.json` and call it before any other `start` and `test` executions.
   > Example:

```json
"scripts": {
  "start": "npm run cls && nest start",
  "test:e2e": "npm run cls && jest --config ./test/jest-e2e.json",
  "cls": "cls"
}
```
