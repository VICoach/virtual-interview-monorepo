import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';

@Module({
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class SharedModule {}
