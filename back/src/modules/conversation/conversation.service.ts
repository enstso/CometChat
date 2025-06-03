import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { PaginatedConversations } from './dto/paginated-conversation.output';
import { ConversationPaginationArgs } from './dto/conversation.args';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(input: CreateConversationInput) {
    return this.prisma.conversation.create({
      data: {
        participants: {
          create: [
            { user: { connect: { id: input.userId1 } } },
            { user: { connect: { id: input.userId2 } } },
          ],
        },
      },
      include: { participants: { include: { user: true } } },
    });
  }
  async paginateUserConversations(
    userId: string,
    args: ConversationPaginationArgs,
  ): Promise<PaginatedConversations> {
    const { take, cursor } = args;

    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      orderBy: { conversation: { updatedAt: 'desc' } },
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: true },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: true, // ✅ important pour correspondre au model Message GraphQL
              },
            },
          },
        },
      },
    });

    const hasNext = participants.length > take;
    const results = hasNext ? participants.slice(0, take) : participants;

    return {
      conversations: results.map((p) => p.conversation),
      nextCursor: hasNext ? results[results.length - 1].id : undefined, // ✅ undefined au lieu de null
    };
  }
}
