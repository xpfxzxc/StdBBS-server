import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TopicEntity } from '../topics/topic.entity';

@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '名称' })
  @Index()
  name: string;

  @Column({ type: 'text', comment: '描述', nullable: true })
  description: string;

  @Column({ name: 'post_count', default: 0, comment: '贴子数' })
  postCount: number;

  @OneToMany(type => TopicEntity, topic => topic.category)
  topics: TopicEntity[];
}
