import { registerAs } from '@nestjs/config';

export default registerAs('images', () => ({
  dest: process.env.IMAGES_DEST,
}));
