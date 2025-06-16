import { ObjectType, Field } from '@nestjs/graphql';
import { Conversation } from '../models/conversation.model';

@ObjectType()
// GraphQL object type representing an edge in a paginated list of conversations
export class ConversationEdge {
  @Field(() => String)
  cursor: string; // The cursor used for pagination, typically conversation ID or timestamp

  @Field(() => Conversation)
  node: Conversation; // The conversation object contained in this edge
}
