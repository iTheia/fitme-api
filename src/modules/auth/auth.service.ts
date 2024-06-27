import { Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';
import { LogoutDTO } from './dto/logout-auth.dto';

@Injectable()
export class AuthService {
  login(LoginDTO: LoginDTO) {
    LoginDTO;
    return;
  }

  register(registerDTO: RegisterDTO) {
    registerDTO;
    return;
  }

  refreshToken() {
    return '';
  }

  changePassword() {
    return '';
  }

  forgotPassword() {
    return;
  }

  logout(logoutDTO: LogoutDTO) {
    logoutDTO;
    return;
  }
}
