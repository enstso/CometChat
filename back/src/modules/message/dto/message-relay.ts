import { ObjectType, Field } from '@nestjs/graphql';
import { MessageEdge } from './message-edge';
import { MessagePageInfo } from './message-page-info';

@ObjectType()
export class MessageConnection {
  @Field(() => [MessageEdge])
  edges: MessageEdge[];

  @Field(() => MessagePageInfo)
  pageInfo: MessagePageInfo;
}
