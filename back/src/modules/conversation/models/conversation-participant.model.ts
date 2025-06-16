import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';

@ObjectType()
// GraphQL object type representing a participant in a conversation
export class ConversationParticipant {
  @Field(() => ID)
  id: string; // Unique identifier of the conversation participant

  @Field(() => User)
  user: User; // The user associated with this participant
}
