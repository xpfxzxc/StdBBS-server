import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { User } from '../common/decorators/user.decorator';
import { imageFileFilter } from '../common/file-filters/image-file-filter';
import { JsonResponse } from '../common/modals/json-response.modal';
import { AuthenticatedGuard } from '../modules/auth/authenticated.guard';
import { UserEntity } from '../modules/users/user.entity';
import { ImageService } from '../services/image.service';
import { UploadService } from '../services/upload.service';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly imageService: ImageService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('images/topics')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
      limits: {
        files: 1,
        fileSize: 2 * 2 ** 20,
        parts: 2,
      },
    }),
  )
  @UseGuards(AuthenticatedGuard)
  async saveTopicImage(
    @Req() req: Request,
    @User() user: UserEntity,
    @UploadedFile() file,
  ) {
    if (
      req['fileValidationError'] ||
      !file ||
      !this.imageService.isImage(file.buffer)
    ) {
      throw new BadRequestException();
    }

    const imageUrl = await this.uploadService.save(
      file,
      'topics',
      `${user.id}`,
      { maxWidth: 1024 },
    );

    return new JsonResponse({
      code: 0,
      data: {
        imageUrl,
      },
    });
  }
}
