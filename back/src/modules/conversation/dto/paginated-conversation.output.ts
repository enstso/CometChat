import { ObjectType, Field } from '@nestjs/graphql';
import { Conversation } from '../models/conversation.model';
@ObjectType()
export class PaginatedConversations {
  @Field(() => [Conversation])
  conversations: Conversation[];

  @Field({ nullable: true })
  nextCursor?: string;
}
