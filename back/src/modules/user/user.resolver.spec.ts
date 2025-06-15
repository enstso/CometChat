import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { User } from './models/user.model';

// Mock du guard pour bypasser la sécurité dans les tests
class MockGqlAuthGuard {
  canActivate(context: ExecutionContext) {
    return true;
  }
}

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            searchUsersByUsername: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useClass(MockGqlAuthGuard)
      .compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  describe('searchUsers', () => {
    it('should return an array of users matching the query', async () => {
      const query = 'john';
      const currentUser: User = {
        id: 'user1',
        auth0Id: 'auth0|user1',
        username: 'john_doe',
        email: 'john@example.com',
      };

      const mockUsers: User[] = [
        { id: 'user2', auth0Id: 'auth0|user2', username: 'johnny', email: 'johnny@example.com' },
        { id: 'user3', auth0Id: 'auth0|user3', username: 'johnathan', email: 'johnathan@example.com' },
      ];

      (userService.searchUsersByUsername as jest.Mock).mockResolvedValue(mockUsers);

      const result = await resolver.searchUsers(query, currentUser);

      expect(userService.searchUsersByUsername).toHaveBeenCalledWith(query, currentUser);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('me', () => {
    it('should return the current user', () => {
      const user: User = {
        id: 'user1',
        auth0Id: 'auth0|user1',
        username: 'john_doe',
        email: 'john@example.com',
      };

      const result = resolver.me(user);

      expect(result).toEqual(user);
    });
  });
});
