import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

import { NotificationEntity } from './notification.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class NotificationSubscriber
  implements EntitySubscriberInterface<NotificationEntity> {
  async afterInsert(event: InsertEvent<NotificationEntity>) {
    const userRepository = event.manager.getRepository(UserEntity);
    const notification = event.entity;
    const notifiableId = notification.notifiableId;

    await userRepository.increment(
      {
        id: notifiableId,
      },
      'notificationCount',
      1,
    );
  }

  async beforeRemove(event: RemoveEvent<NotificationEntity>) {
    const userRepository = event.manager.getRepository(UserEntity);
    const notification = event.entity;
    const notifiableId = notification.notifiableId;

    await userRepository.decrement(
      {
        id: notifiableId,
      },
      'notificationCount',
      1,
    );
  }

  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return NotificationEntity;
  }
}
