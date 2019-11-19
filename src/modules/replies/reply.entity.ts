import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TopicEntity } from '../topics/topic.entity';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'reply' })
export class ReplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(type => TopicEntity, topic => topic.replies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'topic_id' })
  topic: TopicEntity;

  @ManyToOne(type => UserEntity, user => user.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Index()
  createdAt: Number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Index()
  updatedAt: Number;
}
