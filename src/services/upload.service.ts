import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { extname, join } from 'path';
import * as sharp from 'sharp';

import { FileService } from './file.service';

@Injectable()
export class UploadService {
  appUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {
    this.appUrl = configService.get('app.url');
  }

  async delete(url: string): Promise<void> {
    const filePath = join(process.cwd(), 'public', url.split(this.appUrl)[1]);
    await this.fileService.delete(filePath);
  }

  async save(
    file,
    folder: string,
    filePrefix: string,
    options?: { maxWidth?: number },
  ): Promise<string> {
    const date = new Date();
    const timestamp = date.valueOf();
    const fullYear = date.getFullYear();
    const month = date
      .getMonth()
      .toString()
      .padStart(2, '0');
    const day = date
      .getDay()
      .toString()
      .padStart(2, '0');
    const randomStr = Math.random()
      .toString(36)
      .slice(2);
    const ext = extname(file.originalname).toLocaleLowerCase();

    const folderName = `uploads/${folder}/${fullYear}${month}/${day}`;
    const uploadPath = join(process.cwd(), 'public', folderName);
    const fileName = `${filePrefix}-${timestamp}-${randomStr}${ext}`;

    let buffer = file.buffer;
    if (options) {
      const { maxWidth } = options;
      if (maxWidth && ext !== '.gif') {
        buffer = await sharp(buffer)
          .resize(maxWidth, null, { withoutEnlargement: true })
          .toBuffer();
      }
    }

    await this.fileService.write(uploadPath, fileName, buffer);

    return `${this.appUrl}/${folderName}/${fileName}`;
  }
}
