// auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { USER_REQUEST_KEY } from '../constants/auth.constants';
import { JwtPayload } from '../interfaces/auth.inferface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { [USER_REQUEST_KEY]?: JwtPayload }>();
    return request[USER_REQUEST_KEY];
  },
);
