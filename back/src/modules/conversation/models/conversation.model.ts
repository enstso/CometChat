import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from '../../message/message.model';
import { ConversationParticipant } from './conversation-participant.model';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => [Message])
  messages: Message[];

  @Field(() => [ConversationParticipant])
  participants: ConversationParticipant[];
}
