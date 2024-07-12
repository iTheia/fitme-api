import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from 'src/middlewares/guards/google-auth/google-auth.guard';
import { ForgotPassword } from './dto/forgotPassword-auth.dto';
import { ChangePassword } from './dto/changePassword-auth.dto';
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

  @Patch('change-password')
  changePassword(@Body() changePassword: ChangePassword, @Req() req: Request) {
    return this.authService.changePassword(changePassword, req);
  }

  @Post('forged-password')
  forgotPassword(@Body() forgotPassword: ForgotPassword) {
    return this.authService.forgotPassword(forgotPassword);
  }

  @Patch('change-forged-password/:token')
  changeForgotPassword(
    @Body() changePassword: ChangePassword,
    @Param('token') token: string,
  ) {
    return this.authService.changeForgotPassword(changePassword, token);
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
}
