import { ObjectType, Field, ID } from '@nestjs/graphql';

// GraphQL ObjectType representing a User entity
@ObjectType()
export class User {
  @Field(() => ID)
  id: string; // Unique identifier for the user

  @Field(() => String)
  auth0Id: string; // Auth0 identifier for authentication

  @Field()
  username: string; // Username of the user

  @Field({ nullable: true })
  email?: string; // Optional email address of the user
}
