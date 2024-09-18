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

- configure documentation builder at `src/core/app/app.config.ts`

```ts
export const documentationBuilder = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('🚀 AstroBookings 👔 Notify API')
    .setDescription('The API to save and send notifications to users.')
    //.setVersion('1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
```

- call from `main.ts`

```ts
documentationBuilder(app);
```

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
