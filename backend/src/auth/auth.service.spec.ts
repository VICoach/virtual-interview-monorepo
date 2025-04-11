import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mail/mail.service';
import { LoginDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let mailerService: MailerService;

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
    jwtService = module.get<JwtService>(JwtService);
    mailerService = module.get<MailerService>(MailerService);

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

  describe('login', () => {
    it('should return tokens when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        email_confirmed: true,
        accountType: ['user'],
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValueOnce('accessToken');
      mockJwtService.sign.mockReturnValueOnce('refreshToken');

      const result = await service.login(loginDto);

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        email_confirmed: true,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => {});

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when email is not confirmed', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        email_confirmed: false,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_confirmed: false,
      };

      const mockCreatedUser = {
        user_id: 1,
        ...registerDto,
        password: 'hashedPassword',
        email_confirmed: false,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.findUserByUserName.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(mockCreatedUser);
      mockUsersService.findUserByEmail
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockCreatedUser);
      mockJwtService.sign
        .mockReturnValueOnce('verificationToken')
        .mockReturnValueOnce('accessToken');
      mockMailerService.sendVerificationEmail.mockResolvedValue(true);

      const result = await service.register(registerDto);

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(usersService.findUserByUserName).toHaveBeenCalledWith(
        registerDto.username,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mailerService.sendVerificationEmail).toHaveBeenCalled();
      expect(result).toEqual({
        access_token: 'accessToken',
        message: 'Please check your email to verify your account',
      });
    });

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
    });

    it('should throw BadRequestException when email is already registered', async () => {
      const registerDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_confirmed: false,
      };

      mockUsersService.findUserByEmail.mockResolvedValue({
        user_id: 1,
        email: 'test@example.com',
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when username is already taken', async () => {
      const registerDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_confirmed: false,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.findUserByUserName.mockResolvedValue({
        user_id: 1,
        username: 'testuser',
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const token = 'validToken';
      const payload = {
        sub: 1,
        type: 'email-verification',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.user.findFirst.mockResolvedValue({
        user_id: 1,
        verify_token: token,
      });

      const result = await service.verifyEmail(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'email_verification_secret',
      });
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: payload.sub,
          verify_token: token,
        },
      });
      expect(usersService.updateUser).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Email verified successfully',
      });
    });

    it('should throw BadRequestException when token is invalid', async () => {
      const token = 'invalidToken';

      mockJwtService.verify.mockImplementation(() => {
        throw new BadRequestException('Invalid token');
      });

      await expect(service.verifyEmail(token)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when token type is wrong', async () => {
      const token = 'wrongTypeToken';
      const payload = {
        sub: 1,
        type: 'wrong-type',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockJwtService.verify.mockReturnValue(payload);

      await expect(service.verifyEmail(token)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when token is expired', async () => {
      const token = 'expiredToken';
      const payload = {
        sub: 1,
        type: 'email-verification',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired
      };

      mockJwtService.verify.mockReturnValue(payload);

      await expect(service.verifyEmail(token)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when user not found', async () => {
      const token = 'validToken';
      const payload = {
        sub: 1,
        type: 'email-verification',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.verifyEmail(token)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'validRefreshToken';
      const payload = {
        sub: 1,
        type: 'refresh',
      };

      const mockUser = {
        user_id: 1,
        refresh_token: refreshToken,
        accountType: ['user'],
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findUserById.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('newAccessToken')
        .mockReturnValueOnce('newRefreshToken')
        .mockReturnValue('newRefreshToken');

      const result = await service.refreshToken(refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'refresh_secret',
      });
      expect(usersService.findUserById).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual({
        access_token: 'newAccessToken',
        refresh_token: 'newRefreshToken',
      });
    });

    it('should throw UnauthorizedException when token type is wrong', async () => {
      const refreshToken = 'wrongTypeToken';
      const payload = {
        sub: 1,
        type: 'wrong-type',
      };

      mockJwtService.verify.mockReturnValue(payload);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const refreshToken = 'validRefreshToken';
      const payload = {
        sub: 1,
        type: 'refresh',
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findUserById.mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when refresh token mismatch', async () => {
      const refreshToken = 'validRefreshToken';
      const payload = {
        sub: 1,
        type: 'refresh',
      };

      const mockUser = {
        user_id: 1,
        refresh_token: 'differentToken',
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findUserById.mockResolvedValue(mockUser);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const userId = 1;
      const mockUser = {
        user_id: userId,
      };

      mockUsersService.findUserById.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.logout(userId);

      expect(usersService.findUserById).toHaveBeenCalledWith(userId);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { user_id: userId },
        data: {
          access_token: null,
          refresh_token: null,
        },
      });
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should throw BadRequestException when user not found', async () => {
      const userId = 999;

      mockUsersService.findUserById.mockResolvedValue(null);

      await expect(service.logout(userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('forgotPassword', () => {
    it('should send reset password email successfully', async () => {
      const email = 'test@example.com';
      const mockUser = {
        user_id: 1,
        email,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('resetToken');
      mockMailerService.sendResetPasswordEmail.mockResolvedValue(true);

      await service.forgotPassword(email);

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(usersService.updateUser).toHaveBeenCalled();
      expect(mailerService.sendResetPasswordEmail).toHaveBeenCalledWith(
        email,
        'resetToken',
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      const email = 'nonexistent@example.com';

      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await expect(service.forgotPassword(email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const token = 'validToken';
      const newPassword = 'NewPassword123!';
      const confirmPassword = 'NewPassword123!';

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

      await service.resetPassword(token, newPassword, confirmPassword);

      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'email_verification_secret',
      });
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { reset_pass_token: token },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      const token = 'validToken';
      const newPassword = 'NewPassword123!';
      const confirmPassword = 'DifferentPassword123!';

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when password is weak', async () => {
      const token = 'validToken';
      const newPassword = 'weak';
      const confirmPassword = 'weak';

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when token is invalid', async () => {
      const token = 'invalidToken';
      const newPassword = 'NewPassword123!';
      const confirmPassword = 'NewPassword123!';

      mockJwtService.verify.mockImplementation(() => {
        throw new BadRequestException('Invalid token');
      });

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user not found', async () => {
      const token = 'validToken';
      const newPassword = 'NewPassword123!';
      const confirmPassword = 'NewPassword123!';

      const payload = {
        sub: 1,
        type: 'reset',
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.resetPassword(token, newPassword, confirmPassword),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email successfully', async () => {
      const email = 'test@example.com';
      const mockUser = {
        user_id: 1,
        email,
      };

      mockUsersService.findUserByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('verificationToken');
      mockMailerService.sendVerificationEmail.mockResolvedValue(true);

      await service.sendVerificationEmail(email);

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(usersService.updateUser).toHaveBeenCalled();
      expect(mailerService.sendVerificationEmail).toHaveBeenCalledWith(
        email,
        'verificationToken',
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      const email = 'nonexistent@example.com';

      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await expect(service.sendVerificationEmail(email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
