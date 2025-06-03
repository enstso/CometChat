import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/modules/user/user.model";
@ObjectType()
export class ConversationParticipant {
  @Field(() => String)
  id: string;

  @Field(() => User)
  user: User;
}
