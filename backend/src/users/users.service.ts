import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountType } from './entities/AccountType.enum';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Create a new user
   * @param createUserDto
   * @returns User
   * @throws ConflictException
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findBy(
      'email',
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Set the default account type
    const userWithDefaultAccountType = {
      ...createUserDto,
      accountType: [AccountType.USER],
    };

    return this.usersRepository.createUser(userWithDefaultAccountType);
  }

  /**
   * Find a user by email
   * @param email
   * @returns User
   * @throws NotFoundException
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findBy('email', email);
  }

  /**
   * Find a user by ID
   * @param id
   * @returns User
   * @throws NotFoundException
   */
  async findUserById(id: number): Promise<User | null> {
    return await this.usersRepository.findBy('user_id', id);
  }

  /**
   * Find a user by username
   * @param username
   * @returns User
   */
  async findUserByUserName(username: string): Promise<User | null> {
    return await this.usersRepository.findBy('username', username);
  }

  /**
   * Update a user
   * @param id
   * @param updateUserDto
   * @returns User
   * @throws NotFoundException
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findBy('user_id', id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email) {
      const existingUser = await this.usersRepository.findBy(
        'email',
        updateUserDto.email,
      );
      if (existingUser && existingUser.user_id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    return this.usersRepository.updateUser(id, updateUserDto);
  }

  /**
   * Delete a user
   * @param id
   * @returns User
   * @throws NotFoundException
   */
  async deleteUser(id: number): Promise<User> {
    const user = await this.usersRepository.findBy('user_id', id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersRepository.deleteUser(id);
  }

  /**
   * Find all users
   * @returns User[]
   * @throws NotFoundException
   */
  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.findAllUsers();
  }
}
