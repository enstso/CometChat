import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterUserResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  user_id?: string;

  @Field({ nullable: true })
  email?: string;
}
