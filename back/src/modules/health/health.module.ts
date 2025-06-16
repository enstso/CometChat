import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { HealthController } from './health.controller';
import { HealthResolver } from './health.resolver';
import { HealthConsumer } from './health.consumer';

@Module({
  imports: [
    // Register the BullMQ queue named 'health-check-queue'
    // Redis connection is already handled in the BullMqModule globally
    BullModule.registerQueue({
      name: 'health-check-queue',
    }),
  ],
  controllers: [HealthController], // Register the HealthController to handle HTTP requests
  providers: [HealthResolver, HealthConsumer], // Register the GraphQL resolver and queue consumer
})
export class HealthModule {}
