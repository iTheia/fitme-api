import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';

import { ApiTags } from '@nestjs/swagger';
import { TokenAuth } from 'src/middlewares/guards/token-auth/token-auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @Post('change-password')
  changePassword() {
    return this.authService.changePassword();
  }

  @Post('forged-password')
  forgotPassword() {
    return this.authService.forgotPassword();
  }

  @UseGuards(TokenAuth)
  @Get('refresh-token')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req);
  }
}
