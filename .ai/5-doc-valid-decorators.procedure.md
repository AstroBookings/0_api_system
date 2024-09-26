# Documentation and validation decorators

## Context

You are working on a configured NestJS project with the basic structure already set up.

## Goal

- Add validation to the app using class-validator.
- Configure automatic Swagger documentation for the API.

## Instructions

1. Install required packages:

   ```bash
   npm install --save @nestjs/swagger class-validator class-transformer
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

3. Create or update `src/swagger.util.ts`:

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
     import { buildSwaggerDocumentation } from './swagger.util';

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

   /**
    * The input data required to login a user
    */
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
   - Use `@ApiParam()` for parameter descriptions
   - Use `@ApiResponse()` for response descriptions

```typescript
   import { ApiParam, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

/**
 * Get user information by ID.
 */
  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'The ID of the user' })
  @ApiOkResponse({ type: UserDto, description: 'User details' })
  @ApiNotFoundResponse({ description: 'Not found if the user does not exist' })
  async getUserById(@Param('id') userId: string): Promise<UserDto> {
  // ... implementation
  }
```

7. Configure validation pipe in `AppModule`

```typescript
const validationPipeOptions: ValidationPipeOptions = {
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  forbidNonWhitelisted: true,
  transform: true,
};

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe(validationPipeOptions),
    },
  ],
})
export class AppModule {}
```

8. Test the Swagger documentation:
   - Start your application
   - Navigate to `http://localhost:3000/docs` in your browser
   - Verify that all endpoints and models are correctly documented

Remember to follow NestJS best practices, use dependency injection, and maintain consistent naming conventions throughout the implementation.
