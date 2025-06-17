import { ObjectType, Field } from '@nestjs/graphql';
import { MessageEdge } from './message-edge';
import { MessagePageInfo } from './message-page-info';

@ObjectType()
// Defines a GraphQL object type representing a paginated connection of messages
export class MessageConnection {
  @Field(() => [MessageEdge])
  edges: MessageEdge[]; // List of message edges containing messages and their cursors

  @Field(() => MessagePageInfo)
  pageInfo: MessagePageInfo; // Pagination metadata like cursors and page availability
}
