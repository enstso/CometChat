import { Injectable } from '@nestjs/common';
import { MessagePaginationArgs } from './dto/message.args';
import { SendMessageInput } from './dto/send-message.input';
import { Queue } from 'bullmq';
import { PaginatedMessages } from './dto/paginated-message.output';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue('message-queue') private queue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async paginateMessages(
    args: MessagePaginationArgs,
  ): Promise<PaginatedMessages> {
    const { conversationId, take, cursor } = args;

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: { sender: true },
    });

    const hasNext = messages.length > take;
    const results = hasNext ? messages.slice(0, take) : messages;

    return {
      messages: results,
      nextCursor: hasNext ? results[results.length - 1].id : undefined,
    };
  }
  
  async sendMessage(input: SendMessageInput) {
    await this.queue.add('send', input);
    return { result: 'Message en file d’attente' };
  }
}
