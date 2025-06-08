import { IsString } from 'class-validator';

export class MessageConsumerJobDto {
  @IsString()
  content: string;
  @IsString()
  senderId: string;
  @IsString()
  conversationId: string;
  @IsString()
  socketId: string;
}
