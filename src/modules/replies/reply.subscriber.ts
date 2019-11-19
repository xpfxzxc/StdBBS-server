import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

import { ReplyEntity } from './reply.entity';
import { NotificationEntity } from '../notifications/notification.entity';
import { TopicEntity } from '../topics/topic.entity';

@Injectable()
export class ReplySubscriber implements EntitySubscriberInterface<ReplyEntity> {
  async afterInsert(event: InsertEvent<ReplyEntity>) {
    const reply = event.entity;
    const manager = event.manager;
    const topicRepository = manager.getRepository(TopicEntity);
    const notificationRepository = manager.getRepository(NotificationEntity);

    await topicRepository.increment(
      {
        id: reply.topic.id,
      },
      'replyCount',
      1,
    );

    const topic = await topicRepository.findOne(reply.topic.id, {
      relations: ['user'],
    });
    if (topic.user.id !== reply.user.id) {
      const notification = notificationRepository.create({
        data: {
          replyContent: reply.content,
          replyId: reply.id,
          topicId: reply.topic.id,
          topicTitle: reply.topic.title,
          userAvatar: reply.user.avatar,
          userId: reply.user.id,
          userName: reply.user.name,
        },
        notifiableId: topic.user.id,
        type: 'topicReplied',
      });
      await notificationRepository.save(notification);
    }
  }

  async beforeRemove(event: RemoveEvent<ReplyEntity>) {
    const reply = event.entity;
    const manager = event.manager;
    const topicRepository = manager.getRepository(TopicEntity);
    const notificationRepository = manager.getRepository(NotificationEntity);

    await topicRepository.decrement(
      {
        id: reply.topic.id,
      },
      'replyCount',
      1,
    );

    const notificationToDelete = await notificationRepository
      .createQueryBuilder('notification')
      .where(`JSON_EXTRACT(data, '$.replyId') = :replyId`, {
        replyId: reply.id,
      })
      .getOne();
    await notificationRepository.remove(notificationToDelete);
  }

  constructor(@InjectConnection() connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return ReplyEntity;
  }
}
