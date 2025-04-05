import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { MailerService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.email_confirmed) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    // Update both tokens in database
    await this.usersService.updateUser(user.user_id, {
      ...user,
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(registerDto: CreateUserDto) {
    // Validate password strength
    if (!this.isPasswordStrong(registerDto.password)) {
      throw new BadRequestException(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    const existingUser = await this.usersService.findUserByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const existingUsername = await this.usersService.findUserByUserName(
      registerDto.username,
    );
    if (existingUsername) {
      throw new BadRequestException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const user = await this.usersService.createUser({
      ...registerDto,
      password: hashedPassword,
      email_confirmed: false,
    });

    // Send verification email and handle token generation
    await this.sendVerificationEmail(user.email);

    const accessToken = this.generateAccessToken(user);
    return {
      access_token: accessToken,
      message: 'Please check your email to verify your account',
    };
  }

  async verifyEmail(token: string) {
    const payload = this.jwtService.verify<{
      sub: number;
      type: string;
      exp: number;
    }>(token, {
      secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET'),
    });

    if (payload.type !== 'email-verification') {
      throw new BadRequestException('Invalid verification token');
    }

    // Check if token is expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimestamp) {
      throw new BadRequestException('Verification link expired.');
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        user_id: payload.sub,
        verify_token: token,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Update user's email_confirmed status
    await this.usersService.updateUser(user.user_id, {
      ...user,
      email_confirmed: true,
      verify_token: null,
    });

    return {
      message: 'Email verified successfully',
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: number; type: string }>(
        refreshToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findUserById(payload.sub);
      if (!user || user.refresh_token !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.generateAccessToken(user),
        this.generateRefreshToken(user),
      ]);

      // Update both tokens in the database
      await this.usersService.updateUser(user.user_id, {
        ...user,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number) {
    const user = await this.usersService.findUserById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Invalidate both access and refresh tokens
    await this.prismaService.user.update({
      where: { user_id: userId },
      data: {
        access_token: null,
        refresh_token: null,
      },
    });

    return { message: 'Logged out successfully' };
  }

  /**
   * Forgot Password - Generate a reset token and send it via email
   * @param email
   * @throws NotFoundException if user is not found
   */
  async forgotPassword(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a reset token
    const resetPassToken = this.generateResetPassToken(user);

    // Update the user's reset token
    await this.usersService.updateUser(user.user_id, {
      ...user,
      reset_pass_token: resetPassToken,
    });

    // Send the reset email
    await this.mailerService.sendResetPasswordEmail(email, resetPassToken);
  }

  /**
   * Reset Password - Validate the reset token and update the password
   * @param token
   * @param newPassword
   * @throws BadRequestException
   */
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    const payload = this.jwtService.verify<{
      sub: number;
      type: string;
      exp: number;
    }>(token, {
      secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET'),
    });

    // Check if token is expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimestamp) {
      throw new BadRequestException('Verification link expired.');
    }

    const user = await this.prismaService.user.findFirst({
      where: { reset_pass_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Validate password strength
    if (!this.isPasswordStrong(newPassword)) {
      throw new BadRequestException(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password and clear the reset token
    await this.prismaService.user.update({
      where: { user_id: user.user_id },
      data: {
        password: hashedPassword,
        reset_pass_token: null,
      },
    });
  }

  async sendVerificationEmail(email: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verifyToken = this.generateVerificationToken(user);

    await this.usersService.updateUser(user.user_id, {
      ...user,
      verify_token: verifyToken,
    });

    await this.mailerService.sendVerificationEmail(user.email, verifyToken);
  }

  private generateAccessToken(user: User) {
    const payload = {
      sub: user.user_id,
      accountType: user.accountType,
      type: 'access',
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_SECRET_EXPIRES_IN'),
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  private generateRefreshToken(user: User) {
    const payload = {
      sub: user.user_id,
      accountType: user.accountType,
      type: 'refresh',
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRES_IN'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  private generateResetPassToken(user: User) {
    const payload = {
      sub: user.user_id,
      accountType: user.accountType,
      type: 'reset',
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_RESET_PASS_SECRET_EXPIRES_IN'),
      secret: this.configService.get('JWT_RESET_PASS_SECRET'),
    });
  }

  private generateVerificationToken(user: User): string {
    const payload = {
      sub: user.user_id,
      accountType: user.accountType,
      type: 'email-verification',
    };

    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EMAIL_VERIFICATION_EXPIRES_IN'),
      secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET'),
    });
  }

  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }
}
