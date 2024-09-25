# Create an API endpoint for a generic resource

## Context

You are working in a NestJS project with configuration, logging, documentation, validation, and exception filters already set up.

## Goal

Create a RESTful API endpoint for a generic resource that is well documented, validated, and tested.

## Instructions

1. Create a new module for your resource in `src/api/[resource-name]/`:

   - Create `[resource-name].module.ts`
   - Import necessary modules (e.g., TokenModule)
   - Declare controllers and providers

2. Create DTOs in `src/api/[resource-name]/models/`:

   - Create `create-[resource-name].dto.ts` for creation
   - Create `update-[resource-name].dto.ts` for updates
   - Create `[resource-name].dto.ts` for responses
   - Use class-validator decorators for input validation
   - Add JSDoc comments with @example for Swagger documentation

3. Create an entity in `src/api/[resource-name]/models/`:

   - Create `[resource-name].entity.ts`
   - Include all necessary properties
   - Add a method to convert entity to DTO if needed

4. Create a repository abstract class:

   - Create `[resource-name].repository.ts`
   - Define methods for CRUD operations

5. Implement an in-memory repository:

   - Create `[resource-name]-in-memory.repository.ts`
   - Implement the abstract repository class

6. Create a service:

   - Create `[resource-name].service.ts`
   - Implement methods for CRUD operations
   - Use the repository for data persistence
   - Handle business logic and throw appropriate exceptions

7. Create a controller:

   - Create `[resource-name].controller.ts`
   - Implement RESTful endpoints (GET, POST, PUT, DELETE)
   - Use Guards for authentication if necessary
   - Add Swagger decorators for API documentation

8. Update `app.module.ts`:

   - Import the new resource module

9. Write unit tests:

   - Create `[resource-name].service.spec.ts`
   - Test all service methods
   - Mock dependencies and use AAA pattern

10. Write e2e tests:

    - Create `test/[resource-name].e2e-spec.ts`
    - Test all API endpoints
    - Use supertest for HTTP requests

Remember to follow NestJS best practices, use dependency injection, and maintain consistent naming conventions throughout the implementation. Use the users implementation as a reference for structure and patterns.
