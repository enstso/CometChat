import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => String)
  title: string;

  @Field(() => ID)
  userId1: string;

  @Field(() => ID)
  userId2: string;
}
