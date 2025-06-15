import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';


@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field(() => User)
  sender: User;
}
