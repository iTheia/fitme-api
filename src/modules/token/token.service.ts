import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async createToken(
    createTokenDto: CreateTokenDto,
  ): Promise<{ access_token: string }> {
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
}
