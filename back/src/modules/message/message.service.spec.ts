import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageInput } from './dto/send-message.input';
import { MessageConnection } from './dto/message-relay';
import { getQueueToken } from '@nestjs/bull'; // <-- CORRECTION IMPORTANTE

describe('MessageService', () => {
  let service: MessageService;
  let queue: Queue;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getQueueToken('message-queue'), // <-- CORRECTION ICI
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            message: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    queue = module.get<Queue>(getQueueToken('message-queue')); // <-- ET ICI
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('paginateMessages', () => {
    it('should paginate messages correctly', async () => {
      const mockMessages = [
        {
          id: 'msg1',
          content: 'Hello',
          createdAt: new Date(),
          sender: { id: 'user1', username: 'user1' },
        },
        {
          id: 'msg2',
          content: 'Hi',
          createdAt: new Date(),
          sender: { id: 'user2', username: 'user2' },
        },
      ];

      (prisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages);

      const args = { conversationId: 'conv1', limit: 1, cursor: undefined };

      const result: MessageConnection = await service.paginateMessages(args);

      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: { conversationId: 'conv1' },
        orderBy: { createdAt: 'desc' },
        take: 2,
        include: { sender: true },
      });

      expect(result.edges.length).toBeLessThanOrEqual(1);
      expect(result.pageInfo.hasPreviousPage).toBe(true);
      expect(result.pageInfo.startCursor).toBe(result.edges[0].cursor);
    });
  });

  describe('sendMessage', () => {
    it('should add job to queue and return job info', async () => {
      const mockJob = { id: 'job123' };
      (queue.add as jest.Mock).mockResolvedValue(mockJob);

      const input: SendMessageInput = {
        conversationId: 'conv1',
        content: 'Hello',
        senderId: 'user1',
      };

      const result = await service.sendMessage(input);

      expect(queue.add).toHaveBeenCalledWith('send', input);
      expect(result).toEqual({
        result: 'Message en file d’attente',
        jobId: 'job123',
      });
    });
  });
});
