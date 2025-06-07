import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  auth0Id: string;

  @Field()
  username: string;

  @Field({ nullable: true })
  email?: string;
}
