import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from '../types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthProvider.Google,
) {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('googleOauth.clientID'),
      clientSecret: configService.get('googleOauth.clientSecret'),
      callbackURL: configService.get('googleOauth.callbackURL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: AuthProvider.Google,
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
