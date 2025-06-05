import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { SendMessageInput } from './dto/send-message.input';
import { Message } from './message.model';
import { MessageRelay } from './dto/message-relay';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query(() => MessageRelay)
  async getMessages(
    @Args('conversationId') conversationId: string,
    @Args('limit', { nullable: true }) limit: number,
    @Args('cursor', { nullable: true }) cursor?: string,
  ): Promise<MessageRelay> {
    return await this.messageService.paginateMessages({
      conversationId,
      limit,
      cursor,
    });
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
