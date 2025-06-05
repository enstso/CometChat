import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { ConversationPaginationArgs } from './dto/conversation.args';
import { ConversationRelay } from './dto/conversation-relay';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(input: CreateConversationInput): Promise<Conversation> {
    return await this.prisma.conversation.create({
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
  ): Promise<ConversationRelay> {
    const { limit, cursor } = args;

    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      orderBy: { conversation: { updatedAt: 'desc' } },
      take: limit + 1,
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

    const hasNextPage = participants.length > limit;
    const sliced = hasNextPage ? participants.slice(0, limit) : participants;

    const edges = sliced.map((p) => ({
      cursor: Buffer.from(p.conversation.updatedAt.toISOString()).toString(
        'base64',
      ),
      node: p.conversation,
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
}
