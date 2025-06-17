import { ArgsType, Field, Int, ID } from '@nestjs/graphql';

@ArgsType()
// Defines the arguments accepted for paginating messages
export class MessagePaginationArgs {
  @Field(() => ID)
  conversationId: string; // ID of the conversation to fetch messages from

  @Field(() => Int, { defaultValue: 20 })
  limit: number; // Number of messages to fetch per request (default is 20)

  @Field({ nullable: true })
  cursor?: string; // Optional cursor for pagination (message ID or timestamp)
}
