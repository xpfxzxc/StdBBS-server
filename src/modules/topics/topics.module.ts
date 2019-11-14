import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TopicsController } from './topics.controller';
import { TopicEntity } from './topic.entity';
import { TopicsService } from './topics.service';

@Global()
@Module({
  controllers: [TopicsController],
  exports: [TopicsService],
  imports: [TypeOrmModule.forFeature([TopicEntity])],
  providers: [TopicsService],
})
export class TopicsModule {}
