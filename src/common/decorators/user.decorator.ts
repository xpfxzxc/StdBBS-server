import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((fieldName: string, req) => {
  return fieldName ? req.user && req.user[fieldName] : req.user;
});
