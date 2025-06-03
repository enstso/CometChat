import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class PaginateMessagesInput {
  @Field(() => ID)
  conversationId: string;

  @Field(() => Int, { defaultValue: 20 })
  take: number;

  @Field({ nullable: true })
  cursor?: string; // message.id ou message.createdAt
}
