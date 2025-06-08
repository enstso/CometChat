import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { MessageConsumer } from './message.consumer';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    // Connexion Redis déjà faite dans BullMqModule
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    WebsocketModule,
  ],
  providers: [MessageResolver, MessageService, MessageConsumer],
})
export class MessageModule {}
