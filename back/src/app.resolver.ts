import { Query, Resolver } from '@nestjs/graphql';

// GraphQL resolver for the root query
@Resolver()
export class AppResolver {
  // Define a simple query named 'hello' that returns a string
  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL!'; // Return a greeting message
  }
}
