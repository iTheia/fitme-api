import { registerAs } from '@nestjs/config';

export default registerAs('secrets', () => ({
  salt: Number(process.env.SALT),
}));
