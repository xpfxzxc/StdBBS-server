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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AddUserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserUpdateGuard } from './guards/user-update.guard';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { NotAuthenticatedGuard } from '../auth/not-authenticated.guard';
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
    private readonly userService: UsersService,
  ) {}

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOneUserById(id);
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar,
  ) {
    if (
      avatar &&
      (!this.imageService.isImage(avatar.buffer) ||
        !this.imageService.dimension(avatar.buffer, {
          minWidth: 200,
          minHeight: 200,
        }))
    ) {
      throw new BadRequestException();
    }

    const user = await this.userService.findOneUserById(id);
    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.update(user, updateUserDto, avatar);
    return new JsonResponse({ code: 0 });
  }
}
