import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/user/user.model';
@ObjectType()
export class ConversationParticipant {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  user: User;
}
