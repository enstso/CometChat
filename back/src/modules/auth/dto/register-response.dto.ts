import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/modules/user/user.model';

@ObjectType()
export class RegisterResponse {
  @Field()
  message: string;

}
