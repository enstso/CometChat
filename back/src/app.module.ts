import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { GqlModule } from './modules/graphql/graphql.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    BullModule,
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
