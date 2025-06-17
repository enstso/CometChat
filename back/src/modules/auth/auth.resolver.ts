// auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterAuth0User } from './dto/register-auth0-user.dto';
import { RegisterUserResponse } from './dto/register-user-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterUserResponse)
  async registerUser(
    @Args('input') input: RegisterAuth0User,
  ): Promise<RegisterUserResponse> {
    return this.authService.registerUser(input);
  }
}
