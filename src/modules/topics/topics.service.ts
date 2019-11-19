import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { TopicEntity } from './topic.entity';
import { AddTopicDto } from './dto/add-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
  ) {}

  async add(user: UserEntity, addTopicDto: AddTopicDto): Promise<TopicEntity> {
    const topic = this.topicRepository.create({
      ...addTopicDto,
      user,
    });
    return this.topicRepository.save(topic);
  }

  async delete(topic: TopicEntity): Promise<void> {
    await this.topicRepository.remove(topic);
  }

  async findAll(
    options: IPaginationOptions,
    extraOptions: { categoryId?: number; order?: string } = {},
  ): Promise<Pagination<TopicEntity>> {
    const { categoryId, order } = extraOptions;
    const where = {};

    if (categoryId) {
      where['category'] = {};
      where['category']['id'] = categoryId;
    }

    return paginate<TopicEntity>(this.topicRepository, options, {
      relations: ['user', 'category', 'lastReplyUser'],
      where,
      order: this.topicsOrder(order),
    });
  }

  async findAllByUserId(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<TopicEntity>> {
    return paginate<TopicEntity>(this.topicRepository, options, {
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<TopicEntity> {
    return this.topicRepository.findOne(id, {
      relations: ['user', 'category'],
    });
  }

  async update(
    topic: TopicEntity,
    updateTopicDto: UpdateTopicDto,
  ): Promise<void> {
    for (const fieldName in updateTopicDto) {
      topic[fieldName] = updateTopicDto[fieldName];
    }

    await this.topicRepository.save(topic);
  }

  private topicsOrder(
    order: string,
  ): { createdAt: 'DESC' } | { updatedAt: 'DESC' } {
    switch (order) {
      case 'recent':
        return {
          createdAt: 'DESC',
        };
      default:
        return {
          updatedAt: 'DESC',
        };
    }
  }
}
