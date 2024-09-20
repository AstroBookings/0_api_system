# Create an API endpoint

## Context

You are working in a brand new NestJS project, with configuration, logging, documentation, validation and exception filters already set up.

## Goal

Create an API endpoint that is well documented, validated and tested.

## Instructions

work inside the `src/api/` folder

1. Create a new module and import it in the `app.module.ts` file
2. Create a new controller and register it in the current module
   1. Add JSDoc comments to the controller
   2. Add blank lines inside comments to keep them readable at swagger
3. Create a new DTO for any incoming data
   1. Add JSDoc comments to the DTO
   2. Add @example to all properties to be used in the Swagger documentation
   3. Add validation for incoming data
      1. Import `class-validator` and `class-transformer`
      2. Use the `@IsString`, `@IsEmail`, `@IsNumber`, `@IsBoolean`, etc. decorators
4. Create a new DTO for any outgoing data
   1. Do not add any validation to the outgoing data
   2. But add documentation and examples just like for the incoming data
5. Add **e2e tests** for the new resource
   1. Use the `test` folder
   2. Declare constants for input data in a separate file
   3. Describe the resource url
   4. Test each method (GET, POST, PUT, DELETE, etc.) and endpoint
      1. Name variables using inputX, actualX, expectedX pattern
      2. Document using AAA pattern
      3. Use beforeEach to clean up the state before each test
