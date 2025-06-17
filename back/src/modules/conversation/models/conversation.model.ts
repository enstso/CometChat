import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from '../../message/models/message.model';
import { ConversationParticipant } from './conversation-participant.model';

@ObjectType()
// GraphQL object type representing a conversation
export class Conversation {
  @Field(() => ID)
  id: string; // Unique identifier for the conversation

  @Field(() => String)
  title: string; // Title of the conversation

  @Field(() => [Message])
  messages: Message[]; // List of messages in the conversation

  @Field(() => [ConversationParticipant])
  participants: ConversationParticipant[]; // List of participants in the conversation
}
