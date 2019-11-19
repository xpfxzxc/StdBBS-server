import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { AddUserDto } from './dto/add-user.dto';
import { SendUserNotificationsDto } from './dto/send-user-notification.dto';
import { SendUserRepliesDto } from './dto/send-user-replies.dto';
import { SendUserTopicsDto } from './dto/send-user-topics.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserUpdateGuard } from './guards/user-update.guard';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { NotAuthenticatedGuard } from '../auth/not-authenticated.guard';
import { NotificationsService } from '../notifications/notifications.service';
import { RepliesService } from '../replies/replies.service';
import { TopicsService } from '../topics/topics.service';
import { imageFileFilter } from '../../common/file-filters/image-file-filter';
import { CaptchaGuard } from '../../common/guards/captcha.guard';
import { JsonResponse } from '../../common/modals/json-response.modal';
import { ImageService } from '../../services/image.service';

@Controller('users')
export class UsersController {
  @Post()
  @UseGuards(NotAuthenticatedGuard, CaptchaGuard)
  async add(@Body() addUserDto: AddUserDto) {
    const user = await this.userService.add(addUserDto);
    return new JsonResponse({ code: 0, data: { user } });
  }

  constructor(
    private readonly imageService: ImageService,
    private readonly notificationService: NotificationsService,
    private readonly replyService: RepliesService,
    private readonly topicService: TopicsService,
    private readonly userService: UsersService,
  ) {}

  @Get(':id/notifications')
  async sendUserNotifications(
    @Param('id', ParseIntPipe) id: number,
    @Query() { page = 1 }: SendUserNotificationsDto,
  ) {
    if (!(await this.userService.findById(id))) {
      throw new NotFoundException();
    }

    const userNotifications = await this.notificationService.findAllByUserId(
      id,
      {
        page,
        limit: 10,
      },
    );

    this.userService.maskAsRead(id);

    return new JsonResponse({
      code: 0,
      data: {
        userNotifications,
      },
    });
  }

  @Get(':id/topics')
  async sendUserTopics(
    @Param('id', ParseIntPipe) id: number,
    @Query() { page = 1 }: SendUserTopicsDto,
  ) {
    if (!(await this.userService.findById(id))) {
      throw new NotFoundException();
    }

    const userTopics = await this.topicService.findAllByUserId(id, {
      page,
      limit: 5,
    });
    return new JsonResponse({
      code: 0,
      data: {
        userTopics,
      },
    });
  }

  @Get(':id/replies')
  @UseGuards(AuthenticatedGuard)
  async sendUserReplies(
    @Param('id', ParseIntPipe) id: number,
    @Query() { page = 1 }: SendUserRepliesDto,
  ) {
    if (!(await this.userService.findById(id))) {
      throw new NotFoundException();
    }

    const userReplies = await this.replyService.findAllByUserId(id, {
      page,
      limit: 5,
    });
    return new JsonResponse({
      code: 0,
      data: {
        userReplies,
      },
    });
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return new JsonResponse({ code: 0, data: { user } });
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: imageFileFilter,
      limits: {
        files: 1,
      },
    }),
  )
  @UseGuards(AuthenticatedGuard, UserUpdateGuard)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar,
  ) {
    if (
      avatar &&
      (req['fileValidationError'] ||
        !this.imageService.isImage(avatar.buffer) ||
        !this.imageService.dimension(avatar.buffer, {
          minWidth: 200,
          minHeight: 200,
        }))
    ) {
      throw new BadRequestException();
    }

    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.update(user, updateUserDto, avatar);
    return new JsonResponse({ code: 0 });
  }
}
