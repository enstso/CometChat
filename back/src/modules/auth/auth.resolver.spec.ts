import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { RegisterAuth0User } from './dto/register-auth0-user.dto';
import { RegisterUserResponse } from './dto/register-user-response.dto';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const mockAuthService = {
    registerUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('registerUser', () => {
    it('should call authService.registerUser and return the result', async () => {
      const input: RegisterAuth0User = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult: RegisterUserResponse = {
        success: true,
        message: 'User registered successfully',
        user_id: 'user-123',
        email: input.email,
      };

      mockAuthService.registerUser.mockResolvedValue(expectedResult);

      const result = await resolver.registerUser(input);

      expect(authService.registerUser).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedResult);
    });
  });
});
