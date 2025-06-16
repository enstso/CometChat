import { IsString } from 'class-validator';

// DTO class for validating the properties of a message consumed from a job queue
export class MessageConsumerJobDto {
  @IsString() // Validate that 'content' is a string
  content: string;

  @IsString() // Validate that 'senderId' is a string
  senderId: string;

  @IsString() // Validate that 'conversationId' is a string
  conversationId: string;

  @IsString() // Validate that 'socketId' is a string
  socketId: string;
}
