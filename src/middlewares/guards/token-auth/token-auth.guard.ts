import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TokenAuth implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private SECRET_TOKEN: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
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
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
