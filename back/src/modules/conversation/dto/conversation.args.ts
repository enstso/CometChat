import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
// Arguments type for paginating conversations in a query
export class ConversationPaginationArgs {
  @Field(() => Int, { defaultValue: 5 })
  limit: number; // Number of conversations to fetch per page

  @Field({ nullable: true })
  cursor?: string; // Optional cursor for pagination (e.g., ID of ConversationParticipant or Conversation)
}
