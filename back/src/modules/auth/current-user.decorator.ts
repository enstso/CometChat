import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from '../user/user.model';

interface GqlContext {
  req: Request & { user?: User };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): any => {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    return gqlContext.req.user;
  },
);
