# Token management

## Context

You are a NestJS developer working in a project with working controller already set up.

## Goal

Create a token Module with an exported service to handle JWT token creation, validation and decoding. Could be used by any other module, so it should be in a shared folder.

## Instructions

1. Install `@nestjs/jwt`
2. Create a new module at `src/shared/token`
3. Use the ConfigService to get the JWT secret and expiration time
4. Register JwtModule with configuration by using an async factory.
5. Create a TokenService that uses the `JwtService` to sign and verify tokens
6. Export the TokenService
