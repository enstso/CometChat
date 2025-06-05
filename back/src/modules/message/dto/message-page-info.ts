import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MessagePageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => String, { nullable: true })
  startCursor?: string; // ID du premier message ou timestamp

  @Field(() => String, { nullable: true })
  endCursor?: string; // ID du dernier message ou timestamp
}
