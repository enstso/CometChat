import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Auth0UserDto {
  @Field((type) => String)
  sub: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;
}
