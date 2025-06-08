import { ObjectType, Field } from '@nestjs/graphql';
import { Message } from '../models/message.model';

@ObjectType()
export class MessageEdge {
  @Field(() => String)
  cursor: string; // ID du message ou timestamp
  @Field(() => Message)
  node: Message; // Le message lui-même
}
