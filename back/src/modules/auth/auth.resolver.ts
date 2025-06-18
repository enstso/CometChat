// Import necessary decorators and classes from NestJS GraphQL
import { Resolver, Mutation, Args } from '@nestjs/graphql';

// Import the authentication service that contains business logic
import { AuthService } from './auth.service';

// Import the DTO (Data Transfer Object) for registering a user with Auth0
import { RegisterAuth0User } from './dto/register-auth0-user.dto';

// Import the DTO that defines the structure of the registration response
import { RegisterUserResponse } from './dto/register-user-response.dto';

// Define a GraphQL resolver class for handling authentication-related operations
@Resolver()
export class AuthResolver {
  // Inject the AuthService into the resolver via constructor
  constructor(private readonly authService: AuthService) {}

  // Define a GraphQL mutation called 'registerUser'
  // This mutation takes an input of type RegisterAuth0User and returns a RegisterUserResponse
  @Mutation(() => RegisterUserResponse)
  async registerUser(
    @Args('input') input: RegisterAuth0User, // Define the input argument from the GraphQL query
  ): Promise<RegisterUserResponse> {
    // Call the authService's registerUser method with the input and return the result
    return this.authService.registerUser(input);
  }
}
