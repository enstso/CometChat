import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { ConversationPaginationArgs } from './dto/conversation.args';
import { CreateConversationInput } from './dto/create-conversation.input';
import { Conversation } from './models/conversation.model';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ConversationConnection } from './dto/conversation-relay';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  // GraphQL mutation to create a new conversation
  @Mutation(() => Conversation)
  async createConversation(@Args('input') input: CreateConversationInput) {
    return await this.conversationService.create(input);
  }

  // Protect this query with authentication guard
  @UseGuards(GqlAuthGuard)
  // GraphQL query to fetch paginated conversations of the current authenticated user
  @Query(() => ConversationConnection)
  async getUserConversations(
    // Retrieve current user information from context
    @CurrentUser() user: { id: string },
    // Receive pagination arguments for conversations
    @Args() conversationPaginationArgs: ConversationPaginationArgs,
  ) {
    // Delegate fetching paginated conversations to the service layer
    return await this.conversationService.paginateUserConversations(
      user.id,
      conversationPaginationArgs,
    );
  }
}
