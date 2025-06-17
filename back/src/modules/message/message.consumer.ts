import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { MessageConsumerJobDto } from './dto/message-consumer-job.dto';
import { WebsocketService } from '../websocket/websocket.service';

// Define a BullMQ processor for the 'message-queue'
@Processor('message-queue')
export class MessageConsumer extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService, // Inject Prisma service for database operations
    private readonly webSocketService: WebsocketService, // Inject WebSocket service for real-time messaging
  ) {
    super();
  }

  // Process incoming jobs from the queue
  async process(job: Job<MessageConsumerJobDto, any, string>): Promise<void> {
    // Only process jobs with the name 'send'
    if (job.name === 'send') {
      console.log('Message job received (consumer):');
      console.log('✅ Processing job:', job.name);
      console.log('📦 Data:', job.data);

      // Destructure relevant data from the job
      const { content, senderId, conversationId, socketId } = job.data;

      // Find the sender user in the database by their auth0Id
      const sender = await this.prisma.user.findUniqueOrThrow({
        where: { auth0Id: senderId },
      });

      // Save the new message in the database, including sender info
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

      // Emit the new message event via WebSocket to all clients except the sender
      this.webSocketService.server.except(socketId).emit('newMessage', {
        conversationId,
        content: savedMessage.content,
        sender: {
          id: savedMessage.sender.id,
          username: savedMessage.sender.username,
        },
        createdAt: savedMessage.createdAt,
      });

      // Emit an event to update last messages to all connected clients
      this.webSocketService.server.emit('getLastMessages', {
        conversationId,
        content: savedMessage.content,
        sender: {
          id: savedMessage.sender.id,
          username: savedMessage.sender.username,
        },
        createdAt: savedMessage.createdAt,
      });

      // Log success message indicating message was saved and emitted
      console.log(`📨 Message saved and emitted: ${content}`);
    }
  }
}
