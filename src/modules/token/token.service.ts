import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserTokenDTO } from './dto/user-token.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUserToken(createTokenDto: UserTokenDTO) {
    try {
      const payload = {
        sub: createTokenDto.id,
        username: createTokenDto.username,
        roles: [...createTokenDto.roles],
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {}
  }

  async refreshUserToken(refreshToken: RefreshToken) {
    try {
      const { username, sub, roles } = refreshToken;
      const payload = { username, sub, roles };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      });

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateToken(token: string) {
    try {
      const secret = this.configService.get('secretToken.secretToken');

      const verify = this.jwtService.verifyAsync(token, { secret });

      if (!verify) {
        throw new HttpException('Token is invalid', HttpStatus.BAD_REQUEST);
      }

      return verify;
    } catch (error) {
      return error;
    }
  }
}
