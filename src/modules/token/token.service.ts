import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserTokenDTO } from './dto/user-token.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './dto/refresh-token.dto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async createToken(createTokenDto: UserTokenDTO) {
    try {
      const payload = {
        sub: createTokenDto.id,
        username: createTokenDto.username,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {}
  }

  async refreshToken(refreshToken: RefreshToken) {
    try {
      const { username, sub } = refreshToken;
      const payload = { username, sub };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      });

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
