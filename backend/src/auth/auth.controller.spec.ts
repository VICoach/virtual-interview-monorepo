/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResponseUtil } from '../utils/reponse.util';
import { HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    verifyEmail: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    sendVerificationEmail: jest.fn(),
    validateOAuthLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://frontend.url'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      const expectedResult = {
        access_token: 'mockAccessToken',
        message: 'Please check your email to verify your account',
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(
        ResponseUtil.success(
          'User registered successfully',
          expectedResult,
          HttpStatus.CREATED,
        ),
      );
    });

    it('should throw an error when registration fails', async () => {
      const registerDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_confirmed: false,
      };

      mockAuthService.register.mockRejectedValue({
        message: 'Email already registered',
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(controller.register(registerDto)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const expectedResult = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(
        ResponseUtil.success('Login successful', expectedResult),
      );
    });

    it('should throw an error when login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue({
        message: 'Invalid credentials',
        status: HttpStatus.UNAUTHORIZED,
      });

      await expect(controller.login(loginDto)).rejects.toThrow();
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const token = 'validToken';
      const expectedMessage = 'Email verified successfully';

      mockAuthService.verifyEmail.mockResolvedValue({
        message: expectedMessage,
      });

      const result = await controller.verifyEmail(token);

      expect(authService.verifyEmail).toHaveBeenCalledWith(token);
      expect(result).toEqual(ResponseUtil.success(expectedMessage, null));
    });

    it('should throw an error when verification fails', async () => {
      const token = 'invalidToken';

      mockAuthService.verifyEmail.mockRejectedValue({
        message: 'Invalid or expired token',
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(controller.verifyEmail(token)).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockRefreshToken = 'validRefreshToken';
      const mockRequest = {
        cookies: {
          refresh_token: mockRefreshToken,
        },
      };
      const mockResponse = {
        cookie: jest.fn(),
      };

      const expectedResult = {
        access_token: 'newAccessToken',
        refresh_token: 'newRefreshToken',
      };

      mockAuthService.refreshToken.mockResolvedValue(expectedResult);

      const result = await controller.refreshToken(
        mockRequest as any,
        mockResponse as any,
      );

      expect(authService.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expectedResult.refresh_token,
        {
          httpOnly: true,
          secure: false, // test environment
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      );
      expect(result).toEqual(
        ResponseUtil.success('Access token refreshed successfully', {
          access_token: expectedResult.access_token,
        }),
      );
    });

    it('should throw an error when no refresh token is provided', async () => {
      const mockRequest = {
        cookies: {},
      };
      const mockResponse = {
        cookie: jest.fn(),
      };

      await expect(
        controller.refreshToken(mockRequest as any, mockResponse as any),
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockRequest = {
        user: {
          user_id: 1,
          email: 'test@example.com',
          accountType: ['user'],
        },
      };

      mockAuthService.logout.mockResolvedValue({});

      const result = await controller.logout(mockRequest as any);

      expect(authService.logout).toHaveBeenCalledWith(1);
      expect(result).toEqual(
        ResponseUtil.success('Logged out successfully', null),
      );
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email successfully', async () => {
      const email = 'test@example.com';

      mockAuthService.forgotPassword.mockResolvedValue({});

      const result = await controller.forgotPassword(email);

      expect(authService.forgotPassword).toHaveBeenCalledWith(email);
      expect(result).toEqual(
        ResponseUtil.success('Password reset email sent', null),
      );
    });

    it('should throw an error when user not found', async () => {
      const email = 'nonexistent@example.com';

      mockAuthService.forgotPassword.mockRejectedValue({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      });

      await expect(controller.forgotPassword(email)).rejects.toThrow();
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'validToken',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };

      mockAuthService.resetPassword.mockResolvedValue({});

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
        resetPasswordDto.confirmPassword,
      );
      expect(result).toEqual(
        ResponseUtil.success('Password reset successfully', null),
      );
    });

    it('should throw an error when passwords do not match', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'validToken',
        newPassword: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!',
      };

      mockAuthService.resetPassword.mockRejectedValue({
        message: 'Passwords do not match',
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(
        controller.resetPassword(resetPasswordDto),
      ).rejects.toThrow();
    });
  });

  describe('sendVerifyEmail', () => {
    it('should send verification email successfully', async () => {
      const email = 'test@example.com';

      mockAuthService.sendVerificationEmail.mockResolvedValue({});

      const result = await controller.sendVerifyEmail(email);

      expect(authService.sendVerificationEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(
        ResponseUtil.success('Verification email sent successfully', null),
      );
    });

    it('should throw an error when user not found', async () => {
      const email = 'nonexistent@example.com';

      mockAuthService.sendVerificationEmail.mockRejectedValue({
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      });

      await expect(controller.sendVerifyEmail(email)).rejects.toThrow();
    });
  });

  describe('Google OAuth', () => {
    it('googleAuth should initiate OAuth flow', async () => {
      const result = await controller.googleAuth();
      expect(result).toBeUndefined();
    });

    it('googleAuthRedirect should handle callback', () => {
      const mockRequest = {
        user: {
          access_token: 'googleAccessToken',
          refresh_token: 'googleRefreshToken',
        },
      };
      const mockResponse = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      };

      controller.googleAuthRedirect(mockRequest as any, mockResponse as any);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'googleRefreshToken',
        {
          httpOnly: true,
          secure: false, // test environment
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://frontend.url/oauth?access_token=googleAccessToken',
      );
    });
  });
});
