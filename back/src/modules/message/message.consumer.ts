import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Processor('message-queue')
export class MessageConsumer extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<void> {
    if (job.name === 'send') {
      console.log('Message job received (consumer):');
      console.log('✅ Processing job:', job.name);
      console.log('📦 Data:', job.data);

      const { content, senderId, conversationId } = job.data;
      // Here you would typically handle the message sending logic
      // For example, saving the message to the database
      await this.prisma.message.create({
        data: {
          content: content,
          senderId: senderId,
          conversationId: conversationId,
        },
      });
    }
    console.log(`Message saved: ${content}`);
  }
}
