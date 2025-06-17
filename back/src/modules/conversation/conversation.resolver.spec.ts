import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from './conversation.resolver';
import { ConversationService } from './conversation.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { ConversationPaginationArgs } from './dto/conversation.args';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;

  const mockCreate = jest.fn();
  const mockPaginate = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationResolver,
        {
          provide: ConversationService,
          useValue: {
            create: mockCreate,
            paginateUserConversations: mockPaginate,
          },
        },
      ],
    }).compile();

    resolver = module.get<ConversationResolver>(ConversationResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call conversationService.create with input', async () => {
    const input: CreateConversationInput = {
      title: 'Test Conversation',
      userId1: 'user1',
      userId2: 'user2',
    };

    const expectedResult = { id: 'conv1', title: input.title };
    mockCreate.mockResolvedValue(expectedResult);

    const result = await resolver.createConversation(input);

    expect(result).toEqual(expectedResult);
    expect(mockCreate).toHaveBeenCalledWith(input);
  });

  it('should call paginateUserConversations with user id and args', async () => {
    const user: { id: string } = { id: 'user123' };
    const args: ConversationPaginationArgs = { limit: 10 };
    const expectedConnection = { edges: [], pageInfo: {} };

    mockPaginate.mockResolvedValue(expectedConnection);

    const result = await resolver.getUserConversations(user, args);

    expect(result).toEqual(expectedConnection);
    expect(mockPaginate).toHaveBeenCalledWith(user.id, args);
  });
});
