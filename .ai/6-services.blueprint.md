# Services

## Context

You are working in a NestJS project with a working controller already set up.

## Goal

Create a service that is well documented, validated and tested to be used in the controller
The service should consume a base abstract repository to get data from the database
Implement a repository with in-memory database for testing purposes
Provide the in-memory repository in module configuration using DI

## Constraints

- Use `snowflake` to generate unique ids

## Instructions

1. Create an entity in `src/api/[resource-name]/models/`:

   - Create `[resource-name].entity.ts`
   - Include all necessary properties
   - Add a method to convert entity to DTO if needed

2. Create a repository abstract class:

   - Create `[resource-name].repository.ts`
   - Define methods for CRUD or required operations

3. Implement an in-memory repository:

   - Create `[resource-name]-in-memory.repository.ts`
   - Implement the abstract repository class

4. Create a service:

   - Create `[resource-name].service.ts`
   - Implement methods for CRUD or required operations
   - Use the repository for data persistence
   - Handle business logic and throw appropriate exceptions

5. Provide the in-memory repository in module configuration using DI

6. Add JSDoc comments to the service and its public methods

- Use `@description` to describe the service
- Use `@requires` to describe the dependencies
- Use `@param` to describe the parameters
- Use `@returns` to describe the return type
- Use `@throws` to describe exceptions

7. Write unit tests for the service

- Declare constants for input and mock data
- Declare and configure mock functions and objects (repository, etc.)
- Use a `describe` block for each public methods '.method(param)'
- Use an `it` block for each test case with 'should have behavior'
- Comment with `// Arrange`, `// Act`, `// Assert` to clarify the code
- Name variables with `input`, `mock`, `actual`, and `expected` prefixes to improve readability
- Use `beforeEach` to setup the module and dependencies
