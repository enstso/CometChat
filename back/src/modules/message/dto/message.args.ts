import { ArgsType, Field, Int, ID } from '@nestjs/graphql';

@ArgsType()
export class MessagePaginationArgs {
  @Field(() => ID)
  conversationId: string;

  @Field(() => Int, { defaultValue: 20 })
  take: number;

  @Field({ nullable: true })
  cursor?: string; // ID du message (ou createdAt si tu veux baser sur le timestamp)
}
