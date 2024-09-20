# Services

## Context

You are working in a brand new NestJS project, with configuration, logging, documentation, validation, exception filters and a working controller already set up.

## Goal

Create a service that is well documented, validated and tested to be used in the controller
The service should consume a base abstract repository to get data from the database
Implement a repository with in-memory database for testing purposes

## Constraints

- Use `snowflake` to generate unique ids

## Instructions

1. Create a new service and register it as a provider in the current module
2. Add JSDoc comments to the public methods of the service (no need to be swagger compatible)
3. Add **unit tests** for the new service
   1. Describe the class and its methods
   2. Test each public method
      1. Use AAA pattern for documentation
      2. Name variables using inputX, actualX, expectedX pattern
      3. Use mocks for the repository
      4. Use mocks for any other application service
