import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SendMessageResponse {
  @Field()
  result: string;

  @Field(() => ID, { nullable: true })
  jobId?: string;
}
