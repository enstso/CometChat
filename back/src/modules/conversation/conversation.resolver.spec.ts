import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { ConversationPaginationArgs } from './dto/conversation.args';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;
  let service: ConversationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationResolver,
        {
          provide: ConversationService,
          useValue: {
            create: jest.fn(),
            paginateUserConversations: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ConversationResolver>(ConversationResolver);
    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call conversationService.create with input', async () => {
    const input: CreateConversationInput = {
      title: 'Test Conversation',
      userId1: 'user1',
      userId2: 'user2',
    };

    const expectedResult = { id: 'conv1', title: input.title };
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

    const result = await resolver.createConversation(input);
    expect(result).toEqual(expectedResult);
    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('should call paginateUserConversations with user id and args', async () => {
    const user = { id: 'user123' };
    const args: ConversationPaginationArgs = { limit: 10 };
    const expectedConnection = { edges: [], pageInfo: {} };

    jest
      .spyOn(service, 'paginateUserConversations')
      .mockResolvedValue(expectedConnection as any);

    const result = await resolver.getUserConversations(user, args);
    expect(result).toEqual(expectedConnection);
    expect(service.paginateUserConversations).toHaveBeenCalledWith(
      user.id,
      args,
    );
  });
});
