import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CategoryEntity } from '../categories/category.entity';
import { ReplyEntity } from '../replies/reply.entity';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'topic' })
export class TopicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '帖子标题' })
  @Index()
  title: string;

  @Column({ type: 'text', comment: '帖子内容' })
  body: string;

  @Index()
  @ManyToOne(type => UserEntity, user => user.topics, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'category_id', select: false, nullable: true })
  categoryId: number;

  @Index()
  @ManyToOne(type => CategoryEntity, category => category.topics, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({
    name: 'reply_count',
    unsigned: true,
    default: 0,
    comment: '回复数量',
  })
  replyCount: number;

  @Column({
    name: 'view_count',
    unsigned: true,
    default: 0,
    comment: '查看总数',
  })
  viewCount: number;

  @Index()
  @ManyToOne(type => CategoryEntity, category => category.topics, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'last_reply_user_id' })
  lastReplyUser: UserEntity;

  @Column({ default: 0, comment: '可用来做排序使用' })
  order: number;

  @OneToMany(type => ReplyEntity, reply => reply.topic)
  replies: ReplyEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Index()
  createdAt: Number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Index()
  updatedAt: Number;
}
