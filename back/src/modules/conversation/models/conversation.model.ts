import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from 'src/modules/message/models/message.model';
import { ConversationParticipant } from './conversation-participant.model';

@ObjectType()
export class Conversation {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => [Message])
  messages: Message[];

  @Field(() => [ConversationParticipant])
  participants: ConversationParticipant[];
}
