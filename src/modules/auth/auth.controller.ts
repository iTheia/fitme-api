import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { TokenAuth } from 'src/middlewares/guards/token-auth/token-auth.service';
import { GoogleOauthGuard } from 'src/middlewares/guards/google-auth/google-auth.guard';

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

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  authGoogle() {
    return this.authService.authGoogle();
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  googleAuthCallback(@Req() req, @Res() res: Response) {
    return this.authService.googleAuthCallback(req, res);
  }

  @UseGuards(TokenAuth)
  @Get('refresh-token')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req);
  }
}
