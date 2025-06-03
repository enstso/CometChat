import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { HealthController } from './health.controller';
import { HealthResolver } from './health.resolver';
import { HealthConsumer } from './health.consumer';

@Module({
  imports: [
    // Connexion Redis déjà faite dans BullMqModule
    BullModule.registerQueue({
      name: 'health-check-queue',
    }),
  ],
  controllers: [HealthController],
  providers: [HealthResolver, HealthConsumer], // si tu as un consumer
})
export class HealthModule {}
