import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AccountType } from './entities/AccountType.enum';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  const mockUser: User = {
    user_id: 1,
    email: 'test@example.com',
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    accountType: [AccountType.USER],
    email_confirmed: false,
    password: 'hashedPassword',
    refresh_token: null,
    access_token: null,
    verify_token: null,
    reset_pass_token: null,
  };

  const mockUsersRepository = {
    createUser: jest.fn(),
    findBy: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    findAllUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
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

      mockUsersRepository.findBy.mockResolvedValue(null);
      mockUsersRepository.createUser.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(usersRepository.findBy).toHaveBeenCalledWith(
        'email',
        createUserDto.email,
      );
      expect(usersRepository.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        accountType: [AccountType.USER],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when email exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_confirmed: false,
      };

      mockUsersRepository.findBy.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email successfully', async () => {
      const email = 'test@example.com';
      mockUsersRepository.findBy.mockResolvedValue(mockUser);

      const result = await service.findUserByEmail(email);

      expect(usersRepository.findBy).toHaveBeenCalledWith('email', email);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';
      mockUsersRepository.findBy.mockResolvedValue(null);

      const result = await service.findUserByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID successfully', async () => {
      const userId = 1;
      mockUsersRepository.findBy.mockResolvedValue(mockUser);

      const result = await service.findUserById(userId);

      expect(usersRepository.findBy).toHaveBeenCalledWith('user_id', userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const userId = 999;
      mockUsersRepository.findBy.mockResolvedValue(null);

      const result = await service.findUserById(userId);

      expect(result).toBeNull();
    });
  });

  describe('findUserByUserName', () => {
    it('should find a user by username successfully', async () => {
      const username = 'testuser';
      mockUsersRepository.findBy.mockResolvedValue(mockUser);

      const result = await service.findUserByUserName(username);

      expect(usersRepository.findBy).toHaveBeenCalledWith('username', username);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const username = 'nonexistent';
      mockUsersRepository.findBy.mockResolvedValue(null);

      const result = await service.findUserByUserName(username);

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
      };

      const updatedUser = { ...mockUser, firstName: 'Updated' };
      mockUsersRepository.findBy.mockResolvedValue(mockUser);
      mockUsersRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateUserDto);

      expect(usersRepository.findBy).toHaveBeenCalledWith('user_id', userId);
      expect(usersRepository.updateUser).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;
      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
      };

      mockUsersRepository.findBy.mockResolvedValue(null);

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when email exists', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      mockUsersRepository.findBy.mockResolvedValueOnce(mockUser);
      mockUsersRepository.findBy.mockResolvedValueOnce({
        ...mockUser,
        user_id: 2, // Different user
      });

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = 1;
      mockUsersRepository.findBy.mockResolvedValue(mockUser);
      mockUsersRepository.deleteUser.mockResolvedValue(mockUser);

      const result = await service.deleteUser(userId);

      expect(usersRepository.findBy).toHaveBeenCalledWith('user_id', userId);
      expect(usersRepository.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;
      mockUsersRepository.findBy.mockResolvedValue(null);

      await expect(service.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllUsers', () => {
    it('should find all users successfully', async () => {
      const users = [mockUser];
      mockUsersRepository.findAllUsers.mockResolvedValue(users);

      const result = await service.findAllUsers();

      expect(usersRepository.findAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should return empty array when no users found', async () => {
      mockUsersRepository.findAllUsers.mockResolvedValue([]);

      const result = await service.findAllUsers();

      expect(result).toEqual([]);
    });
  });
});
