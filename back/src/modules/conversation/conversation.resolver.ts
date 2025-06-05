import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { PaginatedConversations } from './dto/paginated-conversation.output';
import { ConversationPaginationArgs } from './dto/conversation.args';
import { CreateConversationInput } from './dto/create-conversation.input';
import { Conversation } from './models/conversation.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Mutation(() => Conversation)
  async createConversation(@Args('input') input: CreateConversationInput) {
    return await this.conversationService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedConversations)
  async getUserConversations(
    @CurrentUser() user: { id: string },
    @Args() paginationArgs: ConversationPaginationArgs,
  ) {
    return await this.conversationService.paginateUserConversations(
      user.id,
      paginationArgs,
    );
  }
}
