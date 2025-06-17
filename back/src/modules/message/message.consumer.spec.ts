import { MessageConsumer } from './message.consumer';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketService } from '../websocket/websocket.service';
import { Job } from 'bullmq';

// Test suite for the MessageConsumer class
describe('MessageConsumer', () => {
  let messageConsumer: MessageConsumer;
  let prismaService: PrismaService;
  let websocketService: WebsocketService;

  // Setup mock services and instantiate MessageConsumer before each test
  beforeEach(() => {
    prismaService = {
      user: {
        findUniqueOrThrow: jest.fn(), // Mock the user lookup method
      },
      message: {
        create: jest.fn(), // Mock the message creation method
      },
    } as any;

    websocketService = {
      server: {
        except: jest.fn().mockReturnThis(), // Mock socket.io 'except' method chaining
        emit: jest.fn(), // Mock socket.io 'emit' method
      },
    } as any;

    messageConsumer = new MessageConsumer(prismaService, websocketService);
  });

  // Test processing of a valid 'send' job
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

    // Mock the Prisma service methods to return expected values
    (prismaService.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(
      mockSender,
    );
    (prismaService.message.create as jest.Mock).mockResolvedValue(
      mockSavedMessage,
    );

    // Call the process method with the job
    await messageConsumer.process(job);

    // Verify user lookup was called with correct auth0Id
    expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { auth0Id: jobData.senderId },
    });

    // Verify message creation was called with correct data
    expect(prismaService.message.create).toHaveBeenCalledWith({
      data: {
        content: jobData.content,
        senderId: mockSender.id,
        conversationId: jobData.conversationId,
      },
      include: { sender: true },
    });

    // Verify websocket emits newMessage event excluding the sender's socketId
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

  // Test that jobs with other names are ignored gracefully
  it('should ignore jobs with other names', async () => {
    const job = {
      name: 'other',
      data: {},
    } as Job<any, any, string>;

    // Process should resolve without errors and do nothing
    await expect(messageConsumer.process(job)).resolves.toBeUndefined();

    // None of the service methods should have been called
    expect(prismaService.user.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(prismaService.message.create).not.toHaveBeenCalled();
    expect(websocketService.server.except).not.toHaveBeenCalled();
  });
});
