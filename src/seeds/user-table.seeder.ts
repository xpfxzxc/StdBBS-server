import * as faker from 'faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { truncateTable } from './helper';
import { UserEntity } from '../modules/users/user.entity';

export class UserTableSeeder1572750942849 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const userRepo = queryRunner.manager.getRepository(UserEntity);

    const users = Array.from({ length: 10 }, () => ({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: '$2a$10$dJMDP1vwGrbwM0p6N./HcesKFgM0HqogDUOb/eNaFQqEzsYhmidKG',
      introduction: faker.lorem.sentence(),
      avatar: faker.internet.avatar(),
    }));

    users[0].name = 'admin';
    users[0].email = 'admin@test.com';

    await userRepo.save(users);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await truncateTable(queryRunner, 'user', 'topic', 'reply');
  }
}
