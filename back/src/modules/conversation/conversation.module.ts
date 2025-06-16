import { Module } from '@nestjs/common';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  // Import WebsocketModule to enable real-time communication features
  imports: [WebsocketModule],
  // Register ConversationResolver and ConversationService as providers
  providers: [ConversationResolver, ConversationService],
})
// Defines the ConversationModule which encapsulates conversation-related functionality
export class ConversationModule {}
