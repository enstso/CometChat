import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ConversationPaginationArgs {
  @Field(() => Int, { defaultValue: 5 })
  limit: number;

  @Field({ nullable: true })
  cursor?: string; // ID de ConversationParticipant ou Conversation
}
