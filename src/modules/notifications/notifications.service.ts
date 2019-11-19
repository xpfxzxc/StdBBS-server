import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { NotificationEntity } from './notification.entity';
import { AnyJson } from '../../common/types/any-json.type';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async findAllByUserId(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<NotificationEntity>> {
    return paginate<NotificationEntity>(this.notificationRepository, options, {
      where: {
        notifiableId: userId,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async test() {
    // return this.notificationRepository.find()
  }
}
