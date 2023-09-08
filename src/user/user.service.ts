import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/shared/pagination.dto.shared';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getMe(user: any): Promise<User> {
    const { email } = user;
    const userExist = await this.userRepository.findOneByEmail(email);

    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    userExist.password = undefined;
    return userExist;
  }

  async getAllUser(pagination: PaginationDto): Promise<User[]> {
    const users = await this.userRepository.findAll(pagination);
    return users;
  }
}
