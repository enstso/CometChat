import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockUser = {
    id: '1',
    auth0Id: 'auth0|123',
    email: 'test@example.com',
    username: 'testuser',
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreateUser', () => {
    it('should return existing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOrCreateUser({
        sub: mockUser.auth0Id,
        email: mockUser.email,
        username: mockUser.username,
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { auth0Id: mockUser.auth0Id },
      });
      expect(result).toEqual(mockUser);
    });

    it('should create user if not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await service.findOrCreateUser({
        sub: mockUser.auth0Id,
        email: mockUser.email,
        username: mockUser.username,
      });

      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException on error', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('fail'));

      await expect(
        service.findOrCreateUser({
          sub: 'auth0|fail',
          email: 'fail@example.com',
          username: 'failuser',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findById', () => {
    it('should return user by ID', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findById('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchUsersByUsername', () => {
    it('should return users matching username', async () => {
      const users = [
        { id: '2', username: 'test2', email: 't2@example.com', auth0Id: 'auth0|2' },
      ];

      mockPrisma.user.findMany.mockResolvedValue(users);

      const result = await service.searchUsersByUsername('test', mockUser);

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          NOT: { id: mockUser.id },
          username: {
            startsWith: 'test',
            mode: 'insensitive',
          },
        },
        take: 10,
        select: {
          id: true,
          username: true,
          email: true,
          auth0Id: true,
        },
      });

      expect(result).toEqual(users);
    });
  });
});
