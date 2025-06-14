import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { MessageConsumerJobDto } from './dto/message-consumer-job.dto';
import { WebsocketService } from '../websocket/websocket.service';

@Processor('message-queue')
export class MessageConsumer extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebsocketService,
  ) {
    super();
  }

  async process(job: Job<MessageConsumerJobDto, any, string>): Promise<void> {
    if (job.name === 'send') {
      console.log('Message job received (consumer):');
      console.log('✅ Processing job:', job.name);
      console.log('📦 Data:', job.data);

      const { content, senderId, conversationId, socketId } = job.data;

      const sender = await this.prisma.user.findUniqueOrThrow({
        where: { auth0Id: senderId },
      });

      const savedMessage = await this.prisma.message.create({
        data: {
          content: content,
          senderId: sender.id,
          conversationId: conversationId,
        },
        include: {
          sender: true,
        },
      });

      // ✅ Émission WebSocket
      this.webSocketService.server.except(socketId).emit('newMessage', {
        conversationId,
        content: savedMessage.content,
        sender: {
          id: savedMessage.sender.id,
          username: savedMessage.sender.username,
        },
        createdAt: savedMessage.createdAt,
      });

      this.webSocketService.server.emit('getLastMessages', {
        conversationId,
        content: savedMessage.content,
        sender: {
          id: savedMessage.sender.id,
          username: savedMessage.sender.username,
        },
        createdAt: savedMessage.createdAt,
      });

      console.log(`📨 Message saved and emitted: ${content}`);
    }
  }
}
