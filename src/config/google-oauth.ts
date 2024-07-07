import { registerAs } from '@nestjs/config';

export default registerAs('googleOauth', () => ({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  redirectUrl: process.env.REDIRECT_URL,
}));
