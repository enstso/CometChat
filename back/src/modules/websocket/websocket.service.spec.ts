import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';

describe('WebsocketService', () => {
  let service: WebsocketService;
  let mockServer: Partial<Server>;
  let mockClient: Partial<Socket>;

  beforeEach(() => {
    mockServer = {
      emit: jest.fn(),
    };

    mockClient = {
      id: 'client-123',
      join: jest.fn().mockResolvedValue(undefined),
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
    };

    service = new WebsocketService();
    service.server = mockServer as Server;
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
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      service.handleDisconnect(mockClient as Socket);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Client disconnected: client-123',
      );
    });
  });

  describe('handleMessage', () => {
    it('should emit the message to all clients', () => {
      const message = 'Hello, world!';
      service.handleMessage(message);
      expect(mockServer.emit).toHaveBeenCalledWith('message', message);
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
});
