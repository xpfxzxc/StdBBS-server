import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AddTopicDto } from './dto/add-topic.dto';
import { IndexTopicDto } from './dto/index-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicEntity } from './topic.entity';
import { TopicsService } from './topics.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { RepliesService } from '../replies/replies.service';
import { UserEntity } from '../users/user.entity';
import { User } from '../../common/decorators/user.decorator';
import { JsonResponse } from '../../common/modals/json-response.modal';

@Controller('topics')
export class TopicsController {
  @Post()
  @UseGuards(AuthenticatedGuard)
  async add(@User() user: UserEntity, @Body() addTopicDto: AddTopicDto) {
    const topic = await this.topicService.add(user, addTopicDto);
    return new JsonResponse({
      code: 0,
      data: { topic },
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
    const topic = await this.getTopicOrFail(id);

    if (!user.isAuthorOf(topic)) {
      throw new ForbiddenException();
    }

    await this.topicService.delete(topic);
    return new JsonResponse({ code: 0 });
  }

  @Get()
  async index(@Query() { page = 1, categoryId, order }: IndexTopicDto) {
    const topics = await this.topicService.findAll(
      { page, limit: 20 },
      { categoryId, order },
    );
    return new JsonResponse({
      code: 0,
      data: {
        topics,
      },
    });
  }

  @Get(':id/replies')
  async sendTopicReplies(@Param('id', ParseIntPipe) id: number) {
    if (!(await this.topicService.findById(id))) {
      throw new NotFoundException();
    }

    const topicReplies = await this.replyService.findAllByTopicId(id);
    return new JsonResponse({
      code: 0,
      data: {
        topicReplies,
      },
    });
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const topic = await this.getTopicOrFail(id);
    return new JsonResponse({ code: 0, data: { topic } });
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  async update(
    @User() user: UserEntity,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    const topic = await this.getTopicOrFail(id);

    if (!user.isAuthorOf(topic)) {
      throw new ForbiddenException();
    }

    await this.topicService.update(topic, updateTopicDto);
    return new JsonResponse({ code: 0 });
  }

  private async getTopicOrFail(id: number) {
    const topic = await this.topicService.findById(id);

    if (!topic) {
      throw new NotFoundException();
    }

    return topic;
  }
}
