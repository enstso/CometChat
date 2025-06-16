import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GqlModule } from './modules/graphql/graphql.module';
import { HealthModule } from './modules/health/health.module';
import { BullMqModule } from './modules/bullmq/bullmq.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { MessageModule } from './modules/message/message.module';
import { WebsocketModule } from './modules/websocket/websocket.module';

// Main application module that imports and organizes all feature modules
@Module({
  imports: [
    BullMqModule,           // Module for handling job queues with BullMQ
    GqlModule,              // GraphQL module configuration
    AuthModule,             // Authentication module
    UserModule,             // User management module
    HealthModule,           // Health check module
    ConversationModule,     // Conversation feature module
    MessageModule,          // Messaging feature module
    WebsocketModule,        // WebSocket communication module
  ],
  providers: [AppResolver, AppService], // Provide application-wide resolver and service
})
export class AppModule {}
