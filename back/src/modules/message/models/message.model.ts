import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';

@ObjectType()
// Defines the GraphQL object type for a Message entity
export class Message {
  @Field(() => ID)
  id: string; // Unique identifier for the message

  @Field()
  content: string; // The actual text content of the message

  @Field()
  createdAt: Date; // Timestamp when the message was created

  @Field(() => User)
  sender: User; // The user who sent the message
}
