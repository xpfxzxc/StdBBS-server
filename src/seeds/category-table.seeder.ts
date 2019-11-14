import { MigrationInterface, QueryRunner } from 'typeorm';

import { truncateTable } from './helper';
import { CategoryEntity } from '../modules/categories/category.entity';

export class CategoryTableSeeder1572757168992 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const categoryRepo = queryRunner.manager.getRepository(CategoryEntity);

    await categoryRepo.save([
      {
        name: '分享',
        description: '分享创造，分享发现',
      },
      {
        name: '教程',
        description: '开发技巧，推荐扩展包等',
      },
      {
        name: '问答',
        description: '请保持友善，互帮互助',
      },
      {
        name: '公告',
        description: '站点公告',
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await truncateTable(queryRunner, 'category', 'topic');
  }
}
