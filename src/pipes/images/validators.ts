import { MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';

export const validation = [
  new MaxFileSizeValidator({ maxSize: 1000 }),
  new FileTypeValidator({ fileType: 'image/jpeg' }),
];
