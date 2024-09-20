# Token management

1. Install `@nestjs/jwt`
2. Create a TokenModule at shared folder
3. Configure it reading secret and expiration time from .env files
4. Create a TokenPayload DTO to return decode view of the token
5. Create a Token service to generate, validate and decode a token.
