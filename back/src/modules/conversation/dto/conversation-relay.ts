import { ObjectType, Field } from '@nestjs/graphql';
import { ConversationEdge } from './conversation-edge';
import { ConversationPageInfo } from './conversation-page-info';

@ObjectType()
// GraphQL object type representing a paginated connection of conversations
export class ConversationConnection {
  @Field(() => [ConversationEdge])
  edges: ConversationEdge[]; // List of conversation edges containing nodes and cursors

  @Field(() => ConversationPageInfo)
  pageInfo: ConversationPageInfo; // Pagination information for the current connection
}
