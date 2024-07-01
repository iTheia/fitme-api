import { registerAs } from '@nestjs/config';

export default registerAs('secretToken', () => ({
  secretToken: process.env.SECRET_TOKEN,
}));
