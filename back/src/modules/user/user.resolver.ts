import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  // Cette route est sécurisée, accessible uniquement avec un token JWT valide
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async searchUsers(@Args('query') query: string): Promise<User[]> {
    return await this.userService.searchUsersByUsername(query);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
