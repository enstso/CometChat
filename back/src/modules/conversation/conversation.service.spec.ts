import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketService } from '../websocket/websocket.service';
import { BadRequestException } from '@nestjs/common';

describe('ConversationService', () => {
  let service: ConversationService;
  let prisma: PrismaService;
  let websocket: WebsocketService;

  const mockPrisma = {
    user: { findUnique: jest.fn() },
    conversation: { findFirst: jest.fn(), create: jest.fn() },
    conversationParticipant: { findMany: jest.fn() },
  };

  const mockWebsocket = {
    server: { to: jest.fn().mockReturnThis(), emit: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WebsocketService, useValue: mockWebsocket },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    prisma = module.get<PrismaService>(PrismaService);
    websocket = module.get<WebsocketService>(WebsocketService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if any user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user2' });

      await expect(
        service.create({ userId1: 'u1', userId2: 'u2', title: 'Chat' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return existing conversation if found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user1' });
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user2' });

      const existingConversation = {
        id: 'conv1',
        participants: [{ userId: 'user1' }, { userId: 'user2' }],
        title: 'Existing chat',
      };
      mockPrisma.conversation.findFirst.mockResolvedValue(existingConversation);

      const result = await service.create({ userId1: 'u1', userId2: 'u2', title: 'Chat' });

      expect(result).toBe(existingConversation);
      expect(mockPrisma.conversation.create).not.toHaveBeenCalled();
    });

    it('should create and notify new conversation', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user1' });
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user2' });
      mockPrisma.conversation.findFirst.mockResolvedValue(null);

      const newConversation = { id: 'newConv', title: 'New chat', participants: [] };
      mockPrisma.conversation.create.mockResolvedValue(newConversation);

      const result = await service.create({ userId1: 'u1', userId2: 'u2', title: 'Chat' });

      expect(result).toBe(newConversation);
      expect(mockPrisma.conversation.create).toHaveBeenCalled();
      expect(websocket.server.to).toHaveBeenCalledTimes(2);
      expect(websocket.server.emit).toHaveBeenCalledWith('newConversation', newConversation);
    });
  });

  // Tu peux aussi écrire ici des tests pour paginateUserConversations...
});
