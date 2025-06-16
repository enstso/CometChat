import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { SendMessageInput } from './dto/send-message.input';
import { SendMessageResponse } from './dto/send-message.output';
import { MessagePaginationArgs } from './dto/message.args';
import { MessageConnection } from './dto/message-relay';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let service: MessageService;

  const mockMessageService = {
    paginateMessages: jest.fn(),
    sendMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        { provide: MessageService, useValue: mockMessageService },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
    service = module.get<MessageService>(MessageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMessages', () => {
    it('should call paginateMessages and return the result', async () => {
      const args: MessagePaginationArgs = {} as any; // on passe un objet vide pour bypasser le typage ici
      const mockResult: MessageConnection = {} as any; // mock simplifié

      mockMessageService.paginateMessages.mockResolvedValue(mockResult);

      const result = await resolver.getMessages(args);

      expect(service.paginateMessages).toHaveBeenCalledWith(args);
      expect(result).toBe(mockResult);
    });
  });

  describe('sendMessage', () => {
    it('should call sendMessage and return the response', async () => {
      const input: SendMessageInput = {} as any; // mock input sans propriété
      const mockResponse: SendMessageResponse = {} as any; // mock output simplifié

      mockMessageService.sendMessage.mockResolvedValue(mockResponse);

      const result = await resolver.sendMessage(input);

      expect(service.sendMessage).toHaveBeenCalledWith(input);
      expect(result).toBe(mockResponse);
    });
  });
});
