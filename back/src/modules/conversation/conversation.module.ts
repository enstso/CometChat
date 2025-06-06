import { Module } from '@nestjs/common';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';

@Module({
  providers: [ConversationResolver, ConversationService],
})
export class ConversationModule {}
