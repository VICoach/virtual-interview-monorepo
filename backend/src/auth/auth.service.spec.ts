import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mail/mail.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { ProviderType } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let prismaService: PrismaService;

  const mockUsersService = {
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
    findUserByUserName: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockMailerService = {
    sendVerificationEmail: jest.fn(),
    sendResetPasswordEmail: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    provider: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeAll(() => {
    jest.setTimeout(10000);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Mock bcrypt
    const mockCompare = () => true;
    const mockHash = () => 'hashedPassword';
    jest.spyOn(bcrypt, 'compare').mockImplementation(mockCompare);
    jest.spyOn(bcrypt, 'hash').mockImplementation(mockHash);

    // Mock config values
    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'JWT_SECRET':
          return 'secret';
        case 'JWT_REFRESH_SECRET':
          return 'refresh_secret';
        case 'JWT_RESET_PASS_SECRET':
          return 'reset_pass_secret';
        case 'JWT_EMAIL_VERIFICATION_SECRET':
          return 'email_verification_secret';
        case 'JWT_ACCESS_SECRET_EXPIRES_IN':
          return '15m';
        case 'JWT_REFRESH_SECRET_EXPIRES_IN':
          return '7d';
        case 'JWT_RESET_PASS_SECRET_EXPIRES_IN':
          return '1h';
        case 'JWT_EMAIL_VERIFICATION_EXPIRES_IN':
          return '1d';
        default:
          return null;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockJwtService.sign.mockReset();
    mockUsersService.findUserByEmail.mockReset();
  });

  // ... (keep existing tests but update password validation tests)

  describe('validateOAuthLogin', () => {
    it('should return tokens for existing provider', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        provider: {
          provider_id: '123',
          type: ProviderType.GOOGLE,
        },
      };

      const mockProvider = {
        provider_id: '123',
        type: ProviderType.GOOGLE,
        User: [{ user_id: 1 }],
      };

      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
      };

      mockPrismaService.provider.findFirst.mockResolvedValue(mockProvider);
      mockUsersService.findUserById.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      const result = await service.validateOAuthLogin(userData);

      expect(prismaService.provider.findFirst).toHaveBeenCalledWith({
        where: {
          provider_id: userData.provider.provider_id,
          type: userData.provider.type,
        },
        include: { User: true },
      });
      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      });
    });

    it('should link provider to existing user', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        provider: {
          provider_id: '123',
          type: ProviderType.GOOGLE,
        },
      };

      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
      };

      mockPrismaService.provider.findFirst.mockResolvedValue(null);
      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      mockPrismaService.provider.create.mockResolvedValue({});
      mockJwtService.sign
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      const result = await service.validateOAuthLogin(userData);

      expect(prismaService.provider.create).toHaveBeenCalled();
      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      });
    });

    it('should create new user and provider', async () => {
      const userData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        provider: {
          provider_id: '123',
          type: ProviderType.GOOGLE,
        },
      };

      mockPrismaService.provider.findFirst.mockResolvedValue(null);
      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue({ user_id: 1 });
      mockPrismaService.provider.create.mockResolvedValue({});
      mockJwtService.sign
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      const result = await service.validateOAuthLogin(userData);

      expect(usersService.createUser).toHaveBeenCalled();
      expect(prismaService.provider.create).toHaveBeenCalled();
      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      });
    });
  });

  // Update password validation tests to match current implementation
  describe('register', () => {
    it('should throw BadRequestException when password is weak', async () => {
      const registerDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'weak',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_confirmed: false,
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUsersService.findUserByEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException when password is weak', async () => {
      const token = 'validToken';
      const newPassword = 'weak';
      const confirmPassword = 'weak';

      const payload = {
        sub: 1,
        type: 'reset',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      const mockUser = {
        user_id: 1,
        reset_pass_token: token,
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
