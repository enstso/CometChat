import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';

@ObjectType()
export class ConversationParticipant {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;
}
