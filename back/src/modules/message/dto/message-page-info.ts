import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
// Defines pagination information for a list of messages
export class MessagePageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean; // Indicates if there are more messages after the current page

  @Field(() => Boolean)
  hasPreviousPage: boolean; // Indicates if there are messages before the current page

  @Field(() => String, { nullable: true })
  startCursor?: string; // Cursor for the first message on the current page (ID or timestamp)

  @Field(() => String, { nullable: true })
  endCursor?: string; // Cursor for the last message on the current page (ID or timestamp)
}
