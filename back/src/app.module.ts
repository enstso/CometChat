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

@Module({
  imports: [
    BullMqModule,
    GqlModule,
    AuthModule,
    UserModule,
    HealthModule,
    ConversationModule,
    MessageModule
  ],
  providers: [
    AppResolver,
    AppService,
  ],
})
export class AppModule {}
