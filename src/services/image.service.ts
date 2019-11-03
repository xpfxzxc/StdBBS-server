import { Injectable } from '@nestjs/common';
import * as fileType from 'file-type';
import * as sizeOf from 'image-size';

@Injectable()
export class ImageService {
  isImage(buffer: Buffer): boolean {
    const result = fileType(buffer);
    return result && result.mime.startsWith('image/');
  }

  dimension(
    buffer: Buffer,
    options: {
      minWidth?: number;
      minHeight?: number;
      maxWidth?: number;
      maxHeight?: number;
    },
  ) {
    const { width, height } = sizeOf.imageSize(buffer);
    const { minWidth, minHeight, maxWidth, maxHeight } = options;

    return !(
      (minWidth ? width < minWidth : false) ||
      (minHeight ? height < minHeight : false) ||
      (maxWidth ? width > maxWidth : false) ||
      (maxHeight ? height > maxHeight : false)
    );
  }
}
