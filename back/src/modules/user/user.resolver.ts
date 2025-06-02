import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Resolver,
  Query,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number): Promise<any> {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<any> {
    return this.userService.update(updateUserInput);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<any> {
    return this.userService.delete(id);
  }
}
