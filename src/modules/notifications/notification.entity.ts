import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AnyJson } from '../../common/types/any-json.type';

@Entity({ name: 'notification' })
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  data: AnyJson;

  @Column({ name: 'notifiable_id' })
  notifiableId: number;

  @Column()
  type: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Number;
}
