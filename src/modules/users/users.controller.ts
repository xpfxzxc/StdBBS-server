import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AddUserDto } from './dto/add-user.dto';
import { UsersService } from './users.service';
import { CaptchaGuard } from '../../common/guards/captcha.guard';
import { JsonResponse } from '../../common/modals/json-response.modal';

@Controller('users')
export class UsersController {
  @Post()
  @UseGuards(CaptchaGuard)
  async add(@Body() addUserDto: AddUserDto) {
    const user = await this.userService.add(addUserDto);
    return new JsonResponse({ code: 0, data: { user } });
  }

  constructor(private readonly userService: UsersService) {}
}
