import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
// Defines the GraphQL object type for the response after sending a message
export class SendMessageResponse {
  @Field()
  result: string; // The result status or message of the send operation

  @Field(() => ID, { nullable: true })
  jobId?: string; // Optional job ID for tracking asynchronous processing
}
