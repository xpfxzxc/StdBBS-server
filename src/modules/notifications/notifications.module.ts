import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationEntity } from './notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { NotificationSubscriber } from './notification.subscriber';

@Global()
@Module({
  exports: [NotificationsGateway, NotificationsService],
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [
    NotificationsGateway,
    NotificationsService,
    NotificationSubscriber,
  ],
})
export class NotificationsModule {}
