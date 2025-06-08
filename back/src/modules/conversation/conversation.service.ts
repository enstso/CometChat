import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { ConversationPaginationArgs } from './dto/conversation.args';
import { ConversationConnection } from './dto/conversation-relay';
import { Conversation } from '@prisma/client';
import { WebsocketService } from '../websocket/websocket.service';
@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webSocketService: WebsocketService,
  ) {}
  async create(input: CreateConversationInput): Promise<Conversation> {
    // Récupère les deux utilisateurs
    const user1 = await this.prisma.user.findUnique({
      where: { auth0Id: input.userId1 },
    });
    const user2 = await this.prisma.user.findUnique({
      where: { id: input.userId2 },
    });

    if (!user1 || !user2) {
      throw new BadRequestException('User(s) not found');
    }

    // Vérifie si une conversation existe déjà entre ces deux utilisateurs
    const existing = await this.prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: { in: [user1.id, user2.id] },
          },
        },
      },
      include: {
        participants: { include: { user: true } },
      },
    });

    // Si une conversation existe et contient uniquement ces deux participants
    if (existing && existing.participants.length === 2) {
      return existing;
    }

    // Sinon, on en crée une nouvelle
    const conversation = await this.prisma.conversation.create({
      data: {
        title: input.title,
        participants: {
          create: [
            { user: { connect: { id: user1.id } } },
            { user: { connect: { id: user2.id } } },
          ],
        },
      },
      include: { participants: { include: { user: true } } },
    });
    // Optionnel : notifier via WebSocket
    this.webSocketService.server
      .to(user1.id)
      .emit('newConversation', conversation);
    this.webSocketService.server
      .to(user2.id)
      .emit('newConversation', conversation);

    return conversation;
  }

  async paginateUserConversations(
    userId: string,
    args: ConversationPaginationArgs,
  ): Promise<ConversationConnection> {
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
