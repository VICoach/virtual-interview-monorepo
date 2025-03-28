import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseUtil } from '../utils/reponse.util';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';

interface CustomError {
  message: string;
  status: number;
}

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   * @param createUserDto
   * @returns User
   * @throws HttpException
   */
  @Post()
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      const transformedUser = plainToInstance(User, user);
      return ResponseUtil.success(
        'User created successfully',
        transformedUser,
        HttpStatus.CREATED,
      );
    } catch (error) {
      const typedError = error as CustomError;
      throw new HttpException(
        typedError.message || 'Failed to create user',
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find a user by ID
   * @param id
   * @returns User
   * @throws HttpException
   * @throws NotFoundException
   */
  @Get(':id')
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUserById(@Param('id') id: string) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new NotFoundException('Invalid user ID');
      }

      const user = await this.usersService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const transformedUser = plainToInstance(User, user);
      return ResponseUtil.success('User found successfully', transformedUser);
    } catch (error) {
      const typedError = error as CustomError;
      if (typedError instanceof NotFoundException) {
        throw typedError;
      }
      throw new HttpException(
        typedError.message || 'Failed to find user',
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update a user
   * @param id
   * @param updateUserDto
   * @returns User
   * @throws HttpException
   * @throws NotFoundException
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new NotFoundException('Invalid user ID');
      }

      const user = await this.usersService.updateUser(userId, updateUserDto);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const transformedUser = plainToInstance(User, user);
      return ResponseUtil.success('User updated successfully', transformedUser);
    } catch (error) {
      const typedError = error as CustomError;
      if (typedError instanceof NotFoundException) {
        throw typedError;
      }
      throw new HttpException(
        typedError.message || 'Failed to update user',
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a user
   * @param id
   * @returns User
   * @throws HttpException
   */
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    try {
      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new NotFoundException('Invalid user ID');
      }

      const user = await this.usersService.deleteUser(userId);
      const transformedUser = plainToInstance(User, user);
      return ResponseUtil.success('User deleted successfully', transformedUser);
    } catch (error) {
      const typedError = error as CustomError;
      if (typedError instanceof NotFoundException) {
        throw typedError;
      }
      throw new HttpException(
        typedError.message || 'Failed to delete user',
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find all users
   * @returns User[]
   * @throws HttpException
   * @throws NotFoundException
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @ApiResponse({ status: 404, description: 'No users found' })
  async findAllUsers() {
    try {
      const users = await this.usersService.findAllUsers();
      if (!users.length) {
        throw new NotFoundException('No users found');
      }

      const transformedUsers = plainToInstance(User, users);
      return ResponseUtil.success(
        'Users fetched successfully',
        transformedUsers,
      );
    } catch (error) {
      const typedError = error as CustomError;
      if (typedError instanceof NotFoundException) {
        throw typedError;
      }
      throw new HttpException(
        typedError.message || 'Failed to fetch users',
        typedError.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
