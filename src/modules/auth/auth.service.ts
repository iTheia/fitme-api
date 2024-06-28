import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';
import { LogoutDTO } from './dto/logout-auth.dto';

import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { Auth } from './store/auth.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly AuthModel: Model<Auth>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<{ access_token: string }> {
    try {
      const { username, mail, password, phone, name } = registerDTO;

      const hash = await bcrypt.hash(password, 10);

      const accessUser = new this.AuthModel({
        mail,
        password: hash,
        phone,
        username,
      });
      await accessUser.save();

      const user = await this.userService.create({
        name,
        auth: accessUser,
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
      const { username, password } = loginDTO;

      const access = await this.AuthModel.findOne({ password, username });

      if (access === null) {
        throw new NotFoundException('User or password not found');
      }
      return 'token';
    } catch (error) {
      return error;
    }
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
