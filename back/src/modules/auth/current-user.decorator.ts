import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from '../user/models/user.model';

interface GqlContext {
  // Extend the Express Request to optionally include a user property
  req: Request & { user?: User };
}

// Create a custom decorator to extract the current authenticated user from the GraphQL context
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): any => {
    // Convert the ExecutionContext to a GraphQL-specific context
    const ctx = GqlExecutionContext.create(context);

    // Get the request object from the GraphQL context
    const gqlContext = ctx.getContext<GqlContext>();

    // Return the user attached to the request, if any
    return gqlContext.req.user;
  },
);
