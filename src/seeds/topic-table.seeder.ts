import * as faker from 'faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { CategoryEntity } from '../modules/categories/category.entity';
import { UserEntity } from '../modules/users/user.entity';
import { TopicEntity } from '../modules/topics/topic.entity';

export class TopicTableSeeder1572757732757 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const manager = queryRunner.manager;
    const userRepo = manager.getRepository(UserEntity);
    const categoryRepo = manager.getRepository(CategoryEntity);
    const topicRepo = manager.getRepository(TopicEntity);

    const users = await userRepo.find();
    const categories = await categoryRepo.find();

    const topics = Array.from({ length: 100 }, () =>
      topicRepo.create({
        title: faker.lorem.sentence(),
        body: faker.lorem.sentences(),
        user: faker.helpers.randomize(users),
        category: faker.helpers.randomize(categories),
      }),
    );

    await topicRepo.save(topics);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.clearTable('topic');
  }
}
