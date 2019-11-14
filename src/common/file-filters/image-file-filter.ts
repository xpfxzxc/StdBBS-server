import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (req, file, cb) => {
  const allowedExt = ['.png', '.jpg', '.gif', '.jpeg'];
  const ext = extname(file.originalname);
  if (!allowedExt.includes(ext.toLocaleLowerCase())) {
    req.fileValidationError = true;
    cb(null, false);
  }

  cb(null, true);
};
