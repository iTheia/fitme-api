import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { UserTokenDTO } from './dto/user-token.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private SECRET_TOKEN: ConfigService,
  ) {}

  async createToken(
    createTokenDto: UserTokenDTO,
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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.SECRET_TOKEN.get('secretToken').secretToken,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
