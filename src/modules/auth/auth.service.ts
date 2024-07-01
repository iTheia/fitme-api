import { Injectable } from '@nestjs/common';

import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';
import { LogoutDTO } from './dto/logout-auth.dto';

import { TokenService } from '../token/token.service';

import * as bcrypt from 'bcrypt';
import { AuthRepository } from './store/auth.repository';
import { UserRepository } from '../user/store/user.repository';

const SALT = 10;
@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async register(registerDTO: RegisterDTO) {
    try {
      const { username, mail, password, phone, name } = registerDTO;

      await this.authRepository.failIfExist({ username });

      const hash = await bcrypt.hash(password, SALT);

      const accessUser = await this.authRepository.create({
        mail,
        password: hash,
        phone,
        username,
      });
      await accessUser.save();

      const user = await this.userRepository.create({
        name,
        auth: accessUser._id,
      });

      return await this.tokenService.createToken({
        id: user._id.toString(),
        username: accessUser.username,
      });
    } catch (error) {
      return error;
    }
  }

  async login(loginDTO: LoginDTO) {
    try {
      const access = await this.authRepository.findLogin(loginDTO);

      const user = await this.userRepository.findOneOrFail({
        auth: access._id,
      });

      return await this.tokenService.createToken({
        id: user._id.toString(),
        username: access.username,
      });
    } catch (error) {
      return error;
    }
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
