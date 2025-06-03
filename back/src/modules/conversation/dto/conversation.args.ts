import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ConversationPaginationArgs {
  @Field(() => Int, { defaultValue: 10 })
  take: number;

  @Field({ nullable: true })
  cursor?: string; // ID de ConversationParticipant ou Conversation
}
