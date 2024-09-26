# Authentication Procedure

## Context

You are a NestJS developer working in a project with working controller and token service.

## Goal

Create Authentication guards to protect the API.
Create Authentication guard to identify the user by the token.
Create a custom decorator to get the user from the token.

## Instructions

1. Create an AuthenticationService with a method to validate the API key and a method to validate the user token.
2. Create an AuthApiKeyGuard to validate the API key.

```typescript
@Injectable()
export class AuthApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const expectedApiKey = this.configService.get<string>('API_KEY');
    const request = context.switchToHttp().getRequest<Request>();
    const actualApiKey = request.header('X-API-Key');
    if (actualApiKey === expectedApiKey) {
      return true;
    }
    throw new ForbiddenException('Invalid API Key');
  }
}
```

4. Create an AuthUserTokenGuard to validate the user token.

```typescript
@Injectable()
export class AuthUserTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const actualToken = request.headers.authorization?.split(' ')[1] || '';
    try {
      const payload = await this.tokenService.validateToken(actualToken);
      request.userId = payload.sub;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

5. Create an AuthUser decorator to get the user from the token.

```typescript
export const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const userId = ctx.switchToHttp().getRequest().userId;
  if (!userId) {
    throw new UnauthorizedException('User is not authenticated');
  }
  return userId;
});
```

6. Apply the guards to the endpoints that need authentication.

```typescript
  @Delete('')
  @UseGuards(AuthApiKeyGuard)
  @UseGuards(AuthUserTokenGuard)
  @HttpCode(200)
  @ApiOkResponse({ description: 'Empty response upon successful deletion' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized if the user is not authenticated' })
  @ApiNotFoundResponse({ description: 'Not found if the user does not exist' })
  async delete(@AuthUser() userId: string): Promise<void> {
    return this.authenticationService.delete(userId);
  }
```
