import { ObjectType, Field } from '@nestjs/graphql';
import { Conversation } from '../models/conversation.model';

@ObjectType()
export class ConversationEdge {
  @Field(() => String)
  cursor: string; // ID de la conversation ou timestamp
  @Field(() => Conversation)
  node: Conversation; // La conversation elle-même
}
