import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface GqlContext {
  req: Request;
}

@Injectable()
// Custom authentication guard extending Passport's JWT guard for GraphQL requests
export class GqlAuthGuard extends AuthGuard('jwt') {
  // Override getRequest to extract the HTTP request from the GraphQL execution context
  getRequest(context: ExecutionContext): Request {
    // Create a GraphQL execution context from the generic execution context
    const ctx = GqlExecutionContext.create(context);
    // Extract the request object from the GraphQL context
    const gqlContext = ctx.getContext<GqlContext>();
    return gqlContext.req;
  }
}
