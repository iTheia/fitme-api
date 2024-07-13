import { registerAs } from '@nestjs/config';

export default registerAs('multer', () => ({
  dest: process.env.MULTER_DEST,
}));
