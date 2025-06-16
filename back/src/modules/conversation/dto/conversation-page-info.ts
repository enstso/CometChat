import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
// GraphQL object type representing pagination information for conversations
export class ConversationPageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean; // Indicates if there is a next page available

  @Field(() => Boolean)
  hasPreviousPage: boolean; // Indicates if there is a previous page available

  @Field(() => String, { nullable: true })
  startCursor?: string; // Cursor representing the start of the page (e.g., first message ID or timestamp)

  @Field(() => String, { nullable: true })
  endCursor?: string; // Cursor representing the end of the page (e.g., last message ID or timestamp)
}
