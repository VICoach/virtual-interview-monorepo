import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseUtil } from '../utils/reponse.util';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    findUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    findAllUsers: jest.fn(),
  };

  const mockUser: User = {
    user_id: 1,
    email: 'test@example.com',
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    accountType: ['USER'],
    email_confirmed: false,
    password: 'hashedPassword',
    refresh_token: null,
    access_token: null,
    verify_token: null,
    reset_pass_token: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_confirmed: false,
      };

      mockUsersService.createUser.mockResolvedValue(mockUser);

      const result = await controller.createUser(createUserDto);

      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(
        ResponseUtil.success(
          'User created successfully',
          plainToInstance(User, mockUser),
          HttpStatus.CREATED,
        ),
      );
    });

    it('should throw HttpException when creation fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_confirmed: false,
      };

      mockUsersService.createUser.mockRejectedValue({
        message: 'Email already exists',
        status: HttpStatus.CONFLICT,
      });

      await expect(controller.createUser(createUserDto)).rejects.toThrow();
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID successfully', async () => {
      mockUsersService.findUserById.mockResolvedValue(mockUser);

      const result = await controller.findUserById('1');

      expect(usersService.findUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(
        ResponseUtil.success(
          'User found successfully',
          plainToInstance(User, mockUser),
        ),
      );
    });

    it('should throw NotFoundException for invalid ID', async () => {
      await expect(controller.findUserById('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.findUserById.mockResolvedValue(null);

      await expect(controller.findUserById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
      };

      const updatedUser = { ...mockUser, firstName: 'Updated' };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', updateUserDto);

      expect(usersService.updateUser).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(
        ResponseUtil.success(
          'User updated successfully',
          plainToInstance(User, updatedUser),
        ),
      );
    });

    it('should throw NotFoundException for invalid ID', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
      };

      await expect(
        controller.updateUser('invalid', updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException when update fails', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
      };

      mockUsersService.updateUser.mockRejectedValue({
        message: 'Update failed',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      await expect(controller.updateUser('1', updateUserDto)).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      mockUsersService.deleteUser.mockResolvedValue(mockUser);

      const result = await controller.deleteUser('1');

      expect(usersService.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(
        ResponseUtil.success(
          'User deleted successfully',
          plainToInstance(User, mockUser),
        ),
      );
    });

    it('should throw NotFoundException for invalid ID', async () => {
      await expect(controller.deleteUser('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException when deletion fails', async () => {
      mockUsersService.deleteUser.mockRejectedValue({
        message: 'Deletion failed',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      await expect(controller.deleteUser('1')).rejects.toThrow();
    });
  });

  describe('findAllUsers', () => {
    it('should find all users successfully', async () => {
      const users = [mockUser];
      mockUsersService.findAllUsers.mockResolvedValue(users);

      const result = await controller.findAllUsers();

      expect(usersService.findAllUsers).toHaveBeenCalled();
      expect(result).toEqual(
        ResponseUtil.success(
          'Users fetched successfully',
          plainToInstance(User, users),
        ),
      );
    });

    it('should throw NotFoundException when no users found', async () => {
      mockUsersService.findAllUsers.mockResolvedValue([]);

      await expect(controller.findAllUsers()).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException when fetch fails', async () => {
      mockUsersService.findAllUsers.mockRejectedValue({
        message: 'Fetch failed',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      await expect(controller.findAllUsers()).rejects.toThrow();
    });
  });
});
