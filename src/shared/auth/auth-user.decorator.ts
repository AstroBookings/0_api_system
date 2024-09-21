import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Decorator to get the authenticated user from the request object.
 * @param ctx - The execution context of the request.
 * @returns The userId
 */
export const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const userId = request.userId;
  if (!userId) {
    throw new UnauthorizedException('User is not authenticated');
  }

  return userId;
});
