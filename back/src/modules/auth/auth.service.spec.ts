import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Auth0UserDto } from './dto/auth0-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  const mockUserService = {
    findOrCreateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Nettoyer les mocks entre les tests
  });

  it('should call UserService.findOrCreateUser with the correct payload', async () => {
    const payload: Auth0UserDto = {
      sub: 'auth0|123456',
      email: 'test@example.com',
      username: 'testuser',
    };

    const mockUser = { id: '1', email: 'test@example.com' };
    mockUserService.findOrCreateUser.mockResolvedValue(mockUser);

    const result = await service.validateUser(payload);

    expect(userService.findOrCreateUser).toHaveBeenCalledWith(payload);
    expect(result).toEqual(mockUser);
  });
});
