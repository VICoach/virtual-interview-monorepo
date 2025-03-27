import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpException,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseUtil } from '../utils/reponse.util';
import { JwtAuthGuard } from './auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from './decorators/public.decorator';
import { Response, Request } from 'express';

interface CustomError {
  message: string;
  status: number;
}

interface RequestWithCookies extends Request {
  cookies: {
    refresh_token?: string;
  };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * @param registerDto
   * @returns User
   * @throws HttpException
   */
  @Post('/register')
  @Public()
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: CreateUserDto) {
    try {
      const result = await this.authService.register(registerDto);
      return ResponseUtil.success(
        'User registered successfully',
        result,
        HttpStatus.CREATED,
      );
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Registration failed',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Login a user
   * @param loginDto
   * @returns Success Message, access token and refresh token
   * @throws HttpException
   *
   */
  @Post('/login')
  @Public()
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return ResponseUtil.success('Login successful', result);
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Login failed',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verify email
   * @param token
   * @returns Success message
   * @throws HttpException
   */
  @Post('/verify-email')
  @Public()
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Body('token') token: string) {
    try {
      const result = await this.authService.verifyEmail(token);
      return ResponseUtil.success(result.message, null);
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Email verification failed',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshTokenDto
   * @returns New access token and refresh token
   * @throws HttpException
   */
  @Post('/refresh-token')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken) {
        throw new HttpException(
          'No refresh token provided',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const tokens = await this.authService.refreshToken(refreshToken);

      // Set the new refresh token in an httpOnly cookie
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return ResponseUtil.success('Access token refreshed successfully', {
        access_token: tokens.access_token,
      });
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Refresh token is invalid',
          typedError.status || HttpStatus.UNAUTHORIZED,
        ),
        typedError.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Logout user (invalidate refresh token)
   * @returns Success message
   * @throws HttpException
   */
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indicate that this endpoint requires a bearer token
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @Req()
    req: {
      user: {
        user_id: number;
        email: string;
        accountType: string[];
      };
    },
  ) {
    try {
      await this.authService.logout(req.user.user_id);
      return ResponseUtil.success('Logged out successfully', null);
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Logout failed',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Forgot Password - Send password reset email
   * @param email
   * @returns Success message
   * @throws HttpException
   */
  @Post('/forgot-password')
  @Public()
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body('email') email: string) {
    try {
      await this.authService.forgotPassword(email);
      return ResponseUtil.success('Password reset email sent', null);
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Failed to send reset email',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Reset Password - Reset user password using a token
   * @param resetPasswordDto
   * @returns Success message
   * @throws HttpException
   */
  @Post('/reset-password')
  @Public()
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
        resetPasswordDto.confirmPassword,
      );
      return ResponseUtil.success('Password reset successfully', null);
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Failed to reset password',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // send email to user to verify email
  @Post('/send-verify-email')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Verfication Email sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to send email' })
  async sendVerifyEmail(@Body('email') email: string) {
    try {
      await this.authService.sendVerificationEmail(email);
      return ResponseUtil.success('Verification email sent successfully', null);
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        ResponseUtil.error(
          typedError.message || 'Failed to send verification email',
          typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ),
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
