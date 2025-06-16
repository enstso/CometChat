import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { SendMessageInput } from './dto/send-message.input';
import { Message } from './models/message.model';
import { MessageConnection } from './dto/message-relay';
import { MessagePaginationArgs } from './dto/message.args';
import { SendMessageResponse } from './dto/send-message.output';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  // GraphQL query to fetch paginated messages
  @Query(() => MessageConnection)
  async getMessages(
    @Args() messagePaginationArgs: MessagePaginationArgs,
  ): Promise<MessageConnection> {
    return await this.messageService.paginateMessages(messagePaginationArgs);
  }

  // GraphQL mutation to send a new message
  @Mutation(() => SendMessageResponse)
  async sendMessage(
    @Args('sendMessageInput') sendMessageInput: SendMessageInput,
  ): Promise<SendMessageResponse> {
    return await this.messageService.sendMessage(sendMessageInput);
  }
}
