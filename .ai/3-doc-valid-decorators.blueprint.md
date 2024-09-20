# Documentation and validation decorators

## Documentation

- install swagger `@nestjs/swagger`
- configure plugin at `nest-cli.json`

```json
"compilerOptions": {
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
```

- configure documentation builder at `src/core/app/app.bootstrap.ts`

```ts
export const documentationBuilder = (
  app: INestApplication,
  appConfig: AppConfig,
  logger: LogService,
) => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(appConfig.appTitle)
    .setDescription(appConfig.appDescription)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  logger.log(`📚 ${appConfig.host}:${appConfig.port}/docs`, 'Bootstrap');
};
```

- call from `main.ts`

```ts
documentationBuilder(app);
```

Add JSDoc comments to the DTOs and controllers to document the API.

View the documentation at `http://localhost:3000/docs`.

## Validation

- install class-validator `class-validator` and `class-transformer`

```bash
npm install class-validator class-transformer
```

- configure validation pipe at `main.ts`

```ts
const validationPipeOptions: ValidationPipeOptions = {
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  forbidNonWhitelisted: true,
  transform: true,
};

app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
```
