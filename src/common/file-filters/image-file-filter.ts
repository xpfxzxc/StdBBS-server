import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (req, file, cb) => {
  const allowedExt = ['.png', '.jpg', '.gif', '.jpeg'];
  const ext = extname(file.originalname);
  if (!allowedExt.includes(ext.toLocaleLowerCase())) {
    throw new BadRequestException();
  }

  cb(null, true);
};
