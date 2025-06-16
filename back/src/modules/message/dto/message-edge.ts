import { ObjectType, Field } from '@nestjs/graphql';
import { Message } from '../models/message.model';

@ObjectType()
// Defines a GraphQL object type representing an edge in a paginated message list
export class MessageEdge {
  @Field(() => String)
  cursor: string; // Cursor representing the message ID or timestamp for pagination

  @Field(() => Message)
  node: Message; // The actual message object contained in this edge
}
