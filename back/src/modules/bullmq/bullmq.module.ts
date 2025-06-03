import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
  ],
})

export class BullMqModule {}