import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
// Input type for creating a new conversation
export class CreateConversationInput {
  @Field(() => String)
  title: string; // Title of the conversation

  @Field(() => ID)
  userId1: string; // ID of the first user participating in the conversation

  @Field(() => ID)
  userId2: string; // ID of the second user participating in the conversation
}
