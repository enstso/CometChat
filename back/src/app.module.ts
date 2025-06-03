import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GqlModule } from './modules/graphql/graphql.module';
import { HealthModule } from './modules/health/health.module';
import { BullMqModule } from './modules/bullmq/bullmq.module';

@Module({
  imports: [
    BullMqModule,
    GqlModule,
    AuthModule,
    UserModule,
    HealthModule
  ],
  providers: [
    AppResolver,
    AppService,
  ],
})
export class AppModule {}
