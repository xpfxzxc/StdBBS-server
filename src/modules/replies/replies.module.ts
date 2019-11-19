import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReplyEntity } from './reply.entity';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { ReplySubscriber } from './reply.subscriber';
import { TopicEntity } from '../topics/topic.entity';

@Global()
@Module({
  exports: [RepliesService],
  imports: [TypeOrmModule.forFeature([ReplyEntity, TopicEntity])],
  providers: [ReplySubscriber, RepliesService],
  controllers: [RepliesController],
})
export class RepliesModule {}
