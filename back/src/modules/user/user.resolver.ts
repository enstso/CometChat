import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  // Constructor injects the UserService for data access
  // This resolver handles user-related GraphQL queries
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard) // Protect this query with JWT authentication guard
  async searchUsers(
    @Args('query') query: string, // Search string passed as argument
    @CurrentUser() currentUser: User, // Currently authenticated user injected
  ): Promise<User[]> {
    // Calls the service to search users by username excluding current user
    return await this.userService.searchUsersByUsername(query, currentUser);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard) // Protect this query with JWT authentication guard
  me(@CurrentUser() user: User) {
    // Returns the current authenticated user info
    return user;
  }
}
