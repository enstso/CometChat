import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field()
  content: string;

  @Field(() => ID)
  senderId: string;

  @Field(() => ID)
  conversationId: string;
}
