import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  // Configure BullMQ module with Redis connection details
  imports: [
    BullModule.forRoot({
      connection: {
        // Redis host, defaults to 'localhost' if not specified in environment variables
        host: process.env.REDIS_HOST || 'localhost',
        // Redis port, defaults to 6379 if not specified in environment variables
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
  ],
})
export class BullMqModule {}
