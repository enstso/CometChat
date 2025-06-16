import { MessageConsumer } from './message.consumer';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketService } from '../websocket/websocket.service';
import { Job } from 'bullmq';

describe('MessageConsumer', () => {
  let messageConsumer: MessageConsumer;
  let prismaService: PrismaService;
  let websocketService: WebsocketService;

  beforeEach(() => {
    prismaService = {
      user: {
        findUniqueOrThrow: jest.fn(),
      },
      message: {
        create: jest.fn(),
      },
    } as any;

    websocketService = {
      server: {
        except: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      },
    } as any;

    messageConsumer = new MessageConsumer(prismaService, websocketService);
  });

  it('should process send job correctly', async () => {
    const jobData = {
      content: 'Hello world',
      senderId: 'auth0|123',
      conversationId: 'conv1',
      socketId: 'socket123',
    };

    const job = {
      name: 'send',
      data: jobData,
    } as Job<any, any, string>;

    const mockSender = {
      id: 'user123',
      username: 'john_doe',
    };

    const mockSavedMessage = {
      content: jobData.content,
      sender: mockSender,
      createdAt: new Date(),
    };

    (prismaService.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(
      mockSender,
    );
    (prismaService.message.create as jest.Mock).mockResolvedValue(
      mockSavedMessage,
    );

    await messageConsumer.process(job);

    expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { auth0Id: jobData.senderId },
    });

    expect(prismaService.message.create).toHaveBeenCalledWith({
      data: {
        content: jobData.content,
        senderId: mockSender.id,
        conversationId: jobData.conversationId,
      },
      include: { sender: true },
    });

    expect(websocketService.server.except).toHaveBeenCalledWith(
      jobData.socketId,
    );
    expect(websocketService.server.emit).toHaveBeenCalledWith(
      'newMessage',
      expect.objectContaining({
        conversationId: jobData.conversationId,
        content: jobData.content,
        sender: {
          id: mockSender.id,
          username: mockSender.username,
        },
        createdAt: expect.any(Date),
      }),
    );
  });

  it('should ignore jobs with other names', async () => {
    const job = {
      name: 'other',
      data: {},
    } as Job<any, any, string>;

    // Should not throw and do nothing
    await expect(messageConsumer.process(job)).resolves.toBeUndefined();

    expect(prismaService.user.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(prismaService.message.create).not.toHaveBeenCalled();
    expect(websocketService.server.except).not.toHaveBeenCalled();
  });
});
