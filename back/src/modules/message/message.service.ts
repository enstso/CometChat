import { Injectable } from '@nestjs/common';
import { MessagePaginationArgs } from './dto/message.args';
import { SendMessageInput } from './dto/send-message.input';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { MessageRelay } from './dto/message-relay';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async paginateMessages(args: MessagePaginationArgs): Promise<MessageRelay> {
    const { conversationId, limit, cursor } = args;

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: { sender: true },
    });

    const hasNextPage = messages.length > limit;
    const sliced = hasNextPage ? messages.slice(0, limit) : messages;

    const edges = sliced.map((message) => ({
      cursor: Buffer.from(message.createdAt.toISOString()).toString('base64'),
      node: message,
    }));
    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: false,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
    };
  }

  async sendMessage(input: SendMessageInput) {
    await this.queue.add('send', input);
    return { result: 'Message en file d’attente' };
  }
}
