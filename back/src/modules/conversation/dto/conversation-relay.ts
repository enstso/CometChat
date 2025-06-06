import { ObjectType, Field } from '@nestjs/graphql';
import { ConversationEdge } from './conversation-edge';
import { ConversationPageInfo } from './conversation-page-info';

@ObjectType()
export class ConversationConnection {
  @Field(() => [ConversationEdge])
  edges: ConversationEdge[];

  @Field(() => ConversationPageInfo)
  pageInfo: ConversationPageInfo;
}
