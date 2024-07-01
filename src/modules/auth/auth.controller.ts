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
import { LogoutDTO } from './dto/logout-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { TokenService } from '../token/token.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('logout')
  logout(@Body() logoutDTO: LogoutDTO) {
    return this.authService.logout(logoutDTO);
  }

  @Post('register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @Post('refresh')
  refreshToken() {
    return this.authService.refreshToken();
  }

  @Post('change-password')
  changePassword() {
    return this.authService.changePassword();
  }

  @Post('forged-password')
  forgotPassword() {
    return this.authService.forgotPassword();
  }

  @UseGuards(TokenService)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
