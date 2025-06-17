import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
// Defines the input structure for sending a new message via GraphQL
export class SendMessageInput {
  @Field()
  content: string; // The text content of the message

  @Field(() => ID)
  senderId: string; // ID of the user sending the message

  @Field(() => ID)
  conversationId: string; // ID of the conversation where the message is sent

  @Field(() => String, { nullable: true })
  socketId?: string; // Optional socket ID used for real-time notifications
}
