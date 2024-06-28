import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';
import { LogoutDTO } from './dto/logout-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.schema';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Auth.name) private readonly AuthModel: Model<Auth>,
  ) {}

  login(LoginDTO: LoginDTO) {
    LoginDTO;
    return LoginDTO;
  }

  async register(registerDTO: RegisterDTO) {
    try {
      const { name, username, mail, password, phone } = registerDTO;

      const hash = await bcrypt.hash(password, 10);

      const accessUser = new this.AuthModel({ mail, hash, phone });
      await accessUser.save();

      const createUser = new this.UserModel({
        name,
        username,
        auth: accessUser,
      });
      await createUser.save();

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
