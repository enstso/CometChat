import { MessageConsumer } from '../message/message.consumer';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketService } from '../websocket/websocket.service';
import { Job } from 'bullmq';

describe('MessageConsumer', () => {
  let consumer: MessageConsumer;
  let prisma: PrismaService;
  let websocketService: WebsocketService;
  let mockServer: any;

  beforeEach(() => {
    // Mock PrismaService
    prisma = {
      user: {
        findUniqueOrThrow: jest.fn(),
      },
      message: {
        create: jest.fn(),
      },
    } as any;

    // Mock WebsocketService with server and its methods
    mockServer = {
      except: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };
    websocketService = {
      server: mockServer,
    } as any;

    consumer = new MessageConsumer(prisma, websocketService);
  });

  it('should process a send job successfully', async () => {
    const jobData = {
      content: 'Hello',
      senderId: 'auth0|123',
      conversationId: 'conv-1',
      socketId: 'socket-123',
    };
    const job = {
      name: 'send',
      data: jobData,
    } as Job<any, any, any>;

    // Mock prisma user findUniqueOrThrow to return a user
    prisma.user.findUniqueOrThrow = jest.fn().mockResolvedValue({
      id: 'user-1',
      auth0Id: 'auth0|123',
    });

    // Mock prisma message create to return the saved message
    prisma.message.create = jest.fn().mockResolvedValue({
      content: jobData.content,
      senderId: 'user-1',
      conversationId: jobData.conversationId,
      sender: {
        id: 'user-1',
        username: 'john_doe',
      },
      createdAt: new Date('2025-06-18T12:00:00Z'),
    });

    await consumer.process(job);

    // Verify prisma calls
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { auth0Id: jobData.senderId },
    });
    expect(prisma.message.create).toHaveBeenCalledWith({
      data: {
        content: jobData.content,
        senderId: 'user-1',
        conversationId: jobData.conversationId,
      },
      include: { sender: true },
    });

    // Verify WebSocket emits
    expect(mockServer.except).toHaveBeenCalledWith(jobData.socketId);
    expect(mockServer.except().emit).toHaveBeenCalledWith('newMessage', {
      conversationId: jobData.conversationId,
      content: jobData.content,
      sender: { id: 'user-1', username: 'john_doe' },
      createdAt: expect.any(Date),
    });

    expect(mockServer.emit).toHaveBeenCalledWith('getLastMessages', {
      conversationId: jobData.conversationId,
      content: jobData.content,
      sender: { id: 'user-1', username: 'john_doe' },
      createdAt: expect.any(Date),
    });
  });

  it('should do nothing if job name is not send', async () => {
    const job = {
      name: 'other',
      data: {},
    } as Job<any, any, any>;

    // Should not throw or call anything
    await consumer.process(job);

    expect(prisma.user.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(prisma.message.create).not.toHaveBeenCalled();
    expect(mockServer.except).not.toHaveBeenCalled();
    expect(mockServer.emit).not.toHaveBeenCalled();
  });

  it('should log error if user not found', async () => {
    const jobData = {
      content: 'Hello',
      senderId: 'auth0|123',
      conversationId: 'conv-1',
      socketId: 'socket-123',
    };
    const job = {
      name: 'send',
      data: jobData,
    } as Job<any, any, any>;

    prisma.user.findUniqueOrThrow = jest
      .fn()
      .mockRejectedValue(new Error('User not found'));
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(consumer.process(job)).rejects.toThrow('User not found');

    consoleErrorSpy.mockRestore();
  });

  it('should log error if message creation fails', async () => {
    const jobData = {
      content: 'Hello',
      senderId: 'auth0|123',
      conversationId: 'conv-1',
      socketId: 'socket-123',
    };
    const job = {
      name: 'send',
      data: jobData,
    } as Job<any, any, any>;

    prisma.user.findUniqueOrThrow = jest.fn().mockResolvedValue({
      id: 'user-1',
      auth0Id: 'auth0|123',
    });
    prisma.message.create = jest.fn().mockRejectedValue(new Error('DB error'));
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(consumer.process(job)).rejects.toThrow('DB error');

    consoleErrorSpy.mockRestore();
  });
});
