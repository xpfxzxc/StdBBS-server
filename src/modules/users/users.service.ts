import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { AddUserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { UploadService } from '../../services/upload.service';

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
    private readonly uploadService: UploadService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async update(
    user: UserEntity,
    updateUserDto: UpdateUserDto,
    avatar,
  ): Promise<void> {
    for (const fieldName in updateUserDto) {
      if (!['password', 'confirmPassword'].includes(fieldName)) {
        user[fieldName] = updateUserDto[fieldName];
      }
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (avatar) {
      if (user.avatar) {
        this.uploadService.delete(user.avatar);
      }

      user.avatar = await this.uploadService.save(
        avatar,
        'images/avatars',
        user.id.toString(),
        { maxWidth: 400 },
      );
    }

    await this.userRepository.save(user);
  }
}
