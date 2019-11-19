import { MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';

import { NotificationEntity } from '../modules/notifications/notification.entity';
import { ReplyEntity } from '../modules/replies/reply.entity';
import { TopicEntity } from '../modules/topics/topic.entity';
import { UserEntity } from '../modules/users/user.entity';

export class ReplyTableSeeder1573713942909 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const manager = queryRunner.manager;
    const replyRepo = manager.getRepository(ReplyEntity);
    const topicRepo = manager.getRepository(TopicEntity);
    const userRepo = manager.getRepository(UserEntity);
    const notificationRepo = manager.getRepository(NotificationEntity);

    const topics = await topicRepo.find();
    const users = await userRepo.find();

    let replies = Array.from({ length: 1000 }, () =>
      replyRepo.create({
        content: faker.lorem.sentence(),
        topic: faker.helpers.randomize(topics),
        user: faker.helpers.randomize(users),
      }),
    );

    replies = await replyRepo.save(replies);

    for (const topic of topics) {
      topic.replyCount = await replyRepo.count({ topic: { id: topic.id } });
    }
    await topicRepo.save(topics);

    const notifications: NotificationEntity[] = [];
    for (const reply of replies) {
      const topic = await topicRepo.findOne(reply.topic.id, {
        relations: ['user'],
      });

      if (topic.user.id !== reply.user.id) {
        notifications.push(
          notificationRepo.create({
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
          }),
        );
      }
    }

    await notificationRepo.save(notifications);

    for (let user of users) {
      user.notificationCount += await notificationRepo.count({
        type: 'topicReplied',
        notifiableId: user.id,
      });
    }
    await userRepo.save(users);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.clearTable('reply');
    await queryRunner.manager
      .createQueryBuilder()
      .update(TopicEntity)
      .set({ replyCount: 0 })
      .execute();

    const notificationRepo = queryRunner.manager.getRepository(
      NotificationEntity,
    );
    const userRepo = queryRunner.manager.getRepository(UserEntity);
    const users = await userRepo.find();

    for (let user of users) {
      user.notificationCount -= await notificationRepo.count({
        notifiableId: user.id,
        type: 'topicReplied',
      });
    }
    await userRepo.save(users);

    await notificationRepo.delete({ type: 'topicReplied' });
  }
}
