import { registerAs } from '@nestjs/config';

export default registerAs('salt', () => ({
  salt: process.env.SALT,
}));
