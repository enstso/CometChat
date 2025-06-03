import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { SendMessageInput } from './dto/send-message.input';
import { Message } from './message.model';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Mutation(() => String)
  async sendMessage(
    @Args('sendMessageInput') sendMessageInput: SendMessageInput,
  ) {
    return this.messageService
      .sendMessage(sendMessageInput)
      .then(() => 'Message en file d’attente');
  }
}
