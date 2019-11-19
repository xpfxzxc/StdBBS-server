import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ReplyEntity } from '../replies/reply.entity';
import { TopicEntity } from '../topics/topic.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  @Index()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: '无' })
  introduction: string;

  @OneToMany(type => TopicEntity, topic => topic.user)
  topics: TopicEntity[];

  @OneToMany(type => ReplyEntity, reply => reply.user)
  replies: ReplyEntity[];

  @Column({ name: 'notification_count', default: 0 })
  notificationCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Number;

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  isAuthorOf(entity: TopicEntity | ReplyEntity): boolean {
    return this.id === entity.user.id;
  }
}
