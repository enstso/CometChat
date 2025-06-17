import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { MessageConsumer } from './message.consumer';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    // Register the message queue with BullMQ (Redis connection handled internally)
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    // Import the Websocket module to enable real-time communication
    WebsocketModule,
  ],
  // Provide the resolver, service, and consumer for messages
  providers: [MessageResolver, MessageService, MessageConsumer],
})
export class MessageModule {}
