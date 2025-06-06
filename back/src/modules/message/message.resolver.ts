import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { SendMessageInput } from './dto/send-message.input';
import { Message } from './message.model';
import { MessageRelay } from './dto/message-relay';
import { MessagePaginationArgs } from './dto/message.args';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => MessageRelay)
  async getMessages(
    @Args() messagePaginationArgs: MessagePaginationArgs,
  ): Promise<MessageRelay> {
    return await this.messageService.paginateMessages(messagePaginationArgs);
  }

  @Mutation(() => String)
  async sendMessage(
    @Args('sendMessageInput') sendMessageInput: SendMessageInput,
  ) {
    return this.messageService
      .sendMessage(sendMessageInput)
      .then(() => 'Message en file d’attente');
  }
}
