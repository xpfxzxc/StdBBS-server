import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { ReplyEntity } from './reply.entity';
import { AddReplyDto } from './dto/add-reply.dto';
import { TopicEntity } from '../topics/topic.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(ReplyEntity)
    private readonly replyRepository: Repository<ReplyEntity>,
  ) {}

  async add(
    user: UserEntity,
    topic: TopicEntity,
    addReplyDto: AddReplyDto,
  ): Promise<ReplyEntity> {
    const reply = this.replyRepository.create({
      content: addReplyDto.content,
      topic,
      user,
    });
    return this.replyRepository.save(reply);
  }

  async delete(reply: ReplyEntity): Promise<void> {
    await this.replyRepository.remove(reply);
  }

  async findAllByTopicId(topicId: number): Promise<ReplyEntity[]> {
    return this.replyRepository.find({
      relations: ['user'],
      where: {
        topic: {
          id: topicId,
        },
      },
    });
  }

  async findAllByUserId(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<ReplyEntity>> {
    return paginate<ReplyEntity>(this.replyRepository, options, {
      relations: ['topic'],
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findById(replyId: number): Promise<ReplyEntity> {
    return this.replyRepository.findOne(replyId, {
      relations: ['topic', 'user'],
    });
  }
}
