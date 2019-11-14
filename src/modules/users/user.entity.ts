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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Number;

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
