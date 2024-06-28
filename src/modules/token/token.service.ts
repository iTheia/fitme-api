import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
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

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token${updateTokenDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
