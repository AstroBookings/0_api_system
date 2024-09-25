# Documentation and validation decorators

## Context

You are working on a configured NestJS project with the basic structure already set up.

## Goal

- Add validation to the app using class-validator.
- Configure automatic Swagger documentation for the API.

## Instructions

1. Install required packages:

   ```bash
   npm install --save @nestjs/swagger swagger-ui-express class-validator class-transformer
   ```

2. Update `nest-cli.json` to enable Swagger plugin:

   ```json
   {
     "collection": "@nestjs/schematics",
     "sourceRoot": "src",
     "compilerOptions": {
       "deleteOutDir": true,
       "plugins": [
         {
           "name": "@nestjs/swagger",
           "options": {
             "classValidatorShim": true,
             "introspectComments": true
           }
         }
       ]
     }
   }
   ```

3. Create or update `src/app-bootstrap.util.ts`:

   - Add a function to set up Swagger documentation:

     ```typescript
     import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

     export const buildSwaggerDocumentation = (app: INestApplication) => {
       const appConfig = getAppConfig(app);
       const config = new DocumentBuilder()
         .addBearerAuth()
         .setTitle(appConfig.appTitle)
         .setDescription(appConfig.appDescription)
         .build();

       const document = SwaggerModule.createDocument(app, config);
       SwaggerModule.setup('docs', app, document);
     };
     ```

4. Update `src/main.ts`:

   - Call the Swagger setup function:

     ```typescript
     import { buildSwaggerDocumentation } from './app-bootstrap.util';

     async function bootstrap() {
       const app = await NestFactory.create(AppModule);
       buildSwaggerDocumentation(app);
       // ... other configurations
       await app.listen(3000);
     }
     ```

5. Add Swagger decorators to DTOs:

   - Use `@ApiProperty()` for DTO properties
   - Add examples using `@example` in JSDoc comments
     Example in `src/api/users/models/login.dto.ts`:

   ```typescript
   import { ApiProperty } from '@nestjs/swagger';
   import { IsEmail, IsString, MinLength } from 'class-validator';

   export class LoginDto {
     /**
      * The email of the user
      * @example 'john.doe@example.com'
      */
     @ApiProperty()
     @IsEmail()
     email: string;

     /**
      * The password of the user
      * @example 'password123'
      */
     @ApiProperty()
     @IsString()
     @MinLength(6)
     password: string;
   }
   ```

6. Add Swagger decorators to controllers:

   - Use `@ApiTags()` for controller grouping
   - Use `@ApiOperation()` for endpoint descriptions
   - Use `@ApiResponse()` for response descriptions
     Example in `src/api/users/users.controller.ts`:

   ```typescript
   import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

   @ApiTags('Users')
   @Controller('api/users')
   export class UsersController {
     @Post('login')
     @ApiOperation({ summary: 'User login' })
     @ApiResponse({ status: 200, description: 'Login successful', type: UserTokenDto })
     @ApiResponse({ status: 401, description: 'Unauthorized' })
     async login(@Body() loginDto: LoginDto): Promise<UserTokenDto> {
       // ... implementation
     }
   }
   ```

7. Configure validation pipe in `main.ts`:

   ```typescript
   import { ValidationPipe } from '@nestjs/common';

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     app.useGlobalPipes(
       new ValidationPipe({
         transform: true,
         whitelist: true,
         forbidNonWhitelisted: true,
       }),
     );
     // ... other configurations
   }
   ```

8. Update `.env`, `.env.local`, and `.env.example` files:

   - Add Swagger-related environment variables:
     ```
     SWAGGER_TITLE=Your API Title
     SWAGGER_DESCRIPTION=Your API Description
     ```

9. Update `src/app-bootstrap.util.ts` to use environment variables:

   ```typescript
   export function getAppConfig(app: INestApplication): AppConfig {
     const configService = app.get(ConfigService);
     return {
       // ... other config
       swaggerTitle: configService.get<string>('SWAGGER_TITLE') || 'API Documentation',
       swaggerDescription: configService.get<string>('SWAGGER_DESCRIPTION') || 'API Description',
     };
   }
   ```

10. Test the Swagger documentation:
    - Start your application
    - Navigate to `http://localhost:3000/docs` in your browser
    - Verify that all endpoints and models are correctly documented

Remember to follow NestJS best practices, use dependency injection, and maintain consistent naming conventions throughout the implementation.
