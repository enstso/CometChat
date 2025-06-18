import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';
import { Queue } from 'bullmq';

jest.mock('bullmq', () => {
  return {
    Queue: jest.fn().mockImplementation(() => ({
      add: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('WebsocketService', () => {
  let service: WebsocketService;
  let mockServer: Partial<Server>;
  let mockClient: Partial<Socket>;

  beforeEach(() => {
    mockServer = {
      emit: jest.fn(),
      except: jest.fn().mockReturnThis(),
    };

    mockClient = {
      id: 'client-123',
      join: jest.fn().mockResolvedValue(undefined),
      leave: jest.fn().mockResolvedValue(undefined),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
    };

    service = new WebsocketService();
    service.server = mockServer as Server;

    //@ts-expect-error  accès à la propriété privée "messageQueue"
    service['messageQueue'] = new Queue('message-queue');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log client connection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      service.handleConnection(mockClient as Socket);
      expect(consoleSpy).toHaveBeenCalledWith('Client connected: client-123');
      consoleSpy.mockRestore();
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      service.handleDisconnect(mockClient as Socket);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Client disconnected: client-123',
      );
      consoleSpy.mockRestore();
    });
  });

  describe('handleMessage', () => {
    it('should emit the message to all clients', () => {
      // Version sans ack (ancienne)
      const message = 'Hello, world!';
      // @ts-expect-error to access method
      service.handleMessage(message);
      expect(mockServer.emit).toHaveBeenCalledWith('message', message);
    });

    it('should add job to queue and call ack with queued status', async () => {
      const ack = jest.fn();
      const message = {
        content: 'Hello with queue',
        senderId: 'user-1',
        conversationId: 'conv-1',
      };

      // Appelle la version modifiée avec ack et queue
      await (service as any).handleMessage(message, mockClient as Socket, ack);

      expect(service['messageQueue'].add).toHaveBeenCalledWith('send', {
        content: message.content,
        senderId: message.senderId,
        conversationId: message.conversationId,
        socketId: mockClient.id,
      });
      expect(ack).toHaveBeenCalledWith({ status: 'queued' });
    });

    it('should call ack with error on queue failure', async () => {
      const ack = jest.fn();
      const message = {
        content: 'Fail test',
        senderId: 'user-1',
        conversationId: 'conv-1',
      };

      // Forcer échec queue
      service['messageQueue'].add = jest
        .fn()
        .mockRejectedValue(new Error('Queue error'));

      await (service as any).handleMessage(message, mockClient as Socket, ack);

      expect(ack).toHaveBeenCalledWith({
        status: 'error',
        message: 'Queue error',
      });
    });
  });

  describe('handleJoin', () => {
    it('should join room and notify others', async () => {
      const room = 'test-room';
      const toEmitSpy = jest.fn();
      mockClient.to = jest.fn().mockReturnValue({ emit: toEmitSpy });

      await service.handleJoin(room, mockClient as Socket);

      expect(mockClient.join).toHaveBeenCalledWith(room);
      expect(mockClient.to).toHaveBeenCalledWith(room);
      expect(toEmitSpy).toHaveBeenCalledWith(
        'joined',
        'Client client-123 joined room: test-room',
      );
    });
  });

  describe('handleLeave', () => {
    it('should leave room and notify others', async () => {
      const room = 'test-room';
      const toEmitSpy = jest.fn();
      mockClient.to = jest.fn().mockReturnValue({ emit: toEmitSpy });

      await service.handleLeave(room, mockClient as Socket);

      expect(mockClient.leave).toHaveBeenCalledWith(room);
      expect(mockClient.to).toHaveBeenCalledWith(room);
      expect(toEmitSpy).toHaveBeenCalledWith(
        'left',
        'Client client-123 left room: test-room',
      );
    });
  });
});
