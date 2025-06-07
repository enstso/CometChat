import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { MessageConsumerJobDto } from './dto/message-consumer-job.dto';

@Processor('message-queue')
export class MessageConsumer extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<MessageConsumerJobDto, any, string>): Promise<void> {
    if (job.name === 'send') {
      console.log('Message job received (consumer):');
      console.log('✅ Processing job:', job.name);
      console.log('📦 Data:', job.data);

      const { content, senderId, conversationId } = job.data;
      // Here you would typically handle the message sending logic
      // For example, saving the message to the database
      const sender = await this.prisma.user.findUniqueOrThrow({
        where: { auth0Id: senderId },
      });
      await this.prisma.message.create({
        data: {
          content: content,
          senderId: sender.id,
          conversationId: conversationId,
        },
      });
      console.log(`Message saved: ${content}`);
    }
  }
}
