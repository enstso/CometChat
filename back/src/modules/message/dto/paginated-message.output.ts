import { ObjectType, Field } from '@nestjs/graphql';
import { Message } from '../models/message.model';

@ObjectType()
export class PaginatedMessages {
  @Field(() => [Message])
  messages: Message[];

  @Field({ nullable: true })
  nextCursor?: string;
}
