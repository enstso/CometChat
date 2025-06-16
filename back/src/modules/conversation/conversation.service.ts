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

  // Method to create a new conversation between two users
  async create(input: CreateConversationInput): Promise<Conversation> {
    // Retrieve the first user by their auth0Id
    const user1 = await this.prisma.user.findUnique({
      where: { auth0Id: input.userId1 },
    });
    // Retrieve the second user by their internal id
    const user2 = await this.prisma.user.findUnique({
      where: { id: input.userId2 },
    });

    // Throw an error if one or both users do not exist
    if (!user1 || !user2) {
      throw new BadRequestException('User(s) not found');
    }

    // Check if a conversation already exists between these two users
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

    // If a conversation exists and includes exactly these two participants, return it
    if (existing && existing.participants.length === 2) {
      return existing;
    }

    // Otherwise, create a new conversation with both users as participants
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

    // Optionally notify both users about the new conversation via WebSocket
    this.webSocketService.server
      .to(user1.id)
      .emit('newConversation', conversation);
    this.webSocketService.server
      .to(user2.id)
      .emit('newConversation', conversation);

    // Return the newly created conversation
    return conversation;
  }

  // Method to paginate conversations for a given user
  async paginateUserConversations(
    userId: string,
    args: ConversationPaginationArgs,
  ): Promise<ConversationConnection> {
    const { limit, cursor } = args;

    // Fetch conversation participants for the user, ordered by conversation update date descending
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      orderBy: { conversation: { updatedAt: 'desc' } },
      take: limit + 1, // Fetch one extra to check if there is a next page
      ...(cursor && {
        cursor: { id: cursor }, // Use cursor for pagination if provided
        skip: 1, // Skip the cursor item itself
      }),
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: true }, // Include users of the conversation participants
            },
            messages: {
              orderBy: { createdAt: 'desc' }, // Get latest message in the conversation
              take: 1,
              include: {
                sender: true, // Include sender info (important for GraphQL Message model)
              },
            },
          },
        },
      },
    });

    // Determine if there is a next page based on the extra fetched item
    const hasNextPage = participants.length > limit;
    const sliced = hasNextPage ? participants.slice(0, limit) : participants;

    // Map participants to edges with base64 encoded updatedAt timestamps as cursors
    const edges = sliced.map((p) => ({
      cursor: Buffer.from(p.conversation.updatedAt.toISOString()).toString(
        'base64',
      ),
      node: p.conversation,
    }));

    // Return connection object with edges and pageInfo for Relay-style pagination
    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: false, // Not implemented for previous page yet
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
    };
  }
}
