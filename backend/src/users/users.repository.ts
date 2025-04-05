import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = createUserDto.password;
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    return new User(user); // Map to User instance
  }

  /**
   * Generic find user by a specific field
   * @param field The field to search by (email, user_id, username)
   * @param value The value to search for
   */
  async findBy<T>(field: string, value: T): Promise<User | null> {
    if (value === null || value === undefined) {
      return null;
    }

    const user = await this.prisma.user.findUnique({
      where:
        field === 'user_id'
          ? { user_id: Number(value) }
          : field === 'username'
            ? { username: String(value) }
            : { email: String(value) },
    });
    return user ? new User(user) : null; // Map to User instance
  }

  /**
   * Update a user
   */
  async updateUser(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { user_id: id },
      data: updateData,
    });
    return new User(user); // Map to User instance
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { user_id: id },
    });
    return new User(user); // Map to User instance
  }

  /**
   * Find all users
   */
  async findAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new User(user)); // Map to User instances
  }
}
