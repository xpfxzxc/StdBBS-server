import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AddReplyDto } from './dto/add-reply.dto';
import { ReplyEntity } from './reply.entity';
import { RepliesService } from './replies.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { TopicEntity } from '../topics/topic.entity';
import { TopicsService } from '../topics/topics.service';
import { UserEntity } from '../users/user.entity';
import { User } from '../../common/decorators/user.decorator';
import { JsonResponse } from '../../common/modals/json-response.modal';

@Controller('replies')
export class RepliesController {
  @Post()
  @UseGuards(AuthenticatedGuard)
  async add(@User() user: UserEntity, @Body() addReplyDto: AddReplyDto) {
    const topic = await this.getTopicOrFail(addReplyDto.topicId);
    const reply = await this.replyService.add(user, topic, addReplyDto);
    return new JsonResponse({
      code: 0,
      data: {
        reply,
      },
    });
  }

  constructor(
    private readonly replyService: RepliesService,
    private readonly topicService: TopicsService,
  ) {}

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async delete(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const reply = await this.getReplyOrFail(id);
    const topic = await this.topicService.findById(reply.topic.id);
    if (!user.isAuthorOf(topic) && !user.isAuthorOf(reply)) {
      throw new ForbiddenException();
    }
    await this.replyService.delete(reply);
    return new JsonResponse({ code: 0 });
  }

  private async getReplyOrFail(replyId: number) {
    const reply = await this.replyService.findById(replyId);
    if (!reply) {
      throw new NotFoundException();
    }
    return reply;
  }

  private async getTopicOrFail(topicId: number): Promise<TopicEntity> {
    const topic = await this.topicService.findById(topicId);
    if (!topic) {
      throw new NotFoundException();
    }
    return topic;
  }
}
