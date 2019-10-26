import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddUserDto } from './dto/add-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  async add(addUserDto: AddUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(addUserDto);
    return this.userRepository.save(user);
  }

  async checkIfEmailExists(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({
      where: {
        email,
      },
    }));
  }

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async findOneUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
}
