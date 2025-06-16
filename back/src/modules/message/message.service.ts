import { Injectable } from '@nestjs/common';
import { MessagePaginationArgs } from './dto/message.args';
import { SendMessageInput } from './dto/send-message.input';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { MessageConnection } from './dto/message-relay';
import { SendMessageResponse } from './dto/send-message.output';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue('message-queue') private queue: Queue, // Inject the BullMQ queue for messages
    private readonly prisma: PrismaService, // Inject Prisma service for DB operations
  ) {}

  // Method to paginate messages in a conversation
  async paginateMessages(
    args: MessagePaginationArgs,
  ): Promise<MessageConnection> {
    const { conversationId, limit, cursor } = args;

    // Fetch messages with pagination logic
    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // Fetch one extra to check if there is a previous page
      ...(cursor && {
        cursor: { id: cursor }, // Start from the cursor if provided
        skip: 1, // Skip the cursor message itself
      }),
      include: { sender: true }, // Include sender details with each message
    });

    // Determine if there is a previous page
    const hasPreviousPage = messages.length > limit;
    // Slice to return only the limit number of messages
    const sliced = hasPreviousPage ? messages.slice(0, limit) : messages;

    // Map messages into edges with cursors
    const edges = sliced.map((message) => ({
      cursor: message.id,
      node: message,
    }));

    // Return paginated message connection with page info
    return {
      edges,
      pageInfo: {
        hasPreviousPage,
        hasNextPage: false, // No next page logic implemented here
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
    };
  }

  // Method to enqueue a new message for sending
  async sendMessage(input: SendMessageInput): Promise<SendMessageResponse> {
    // Add a 'send' job to the queue with the message input
    const job = await this.queue.add('send', input);
    // Return a response indicating the message is queued with the job ID
    return {
      result: 'Message en file d’attente',
      jobId: job.id,
    };
  }
}
