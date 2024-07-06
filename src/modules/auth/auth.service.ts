import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';
import { TokenService } from '../token/token.service';
import { TokenAuth } from 'src/middlewares/guards/token-auth/token-auth.service';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './store/auth.repository';
import { UserRepository } from '../user/store/user.repository';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './types';

const SALT = 10;
const MAX_AGE = 60 * 60 * 60 * 24 * 7;
@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenAuth: TokenAuth,
    private configService: ConfigService,
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

  async refreshToken(req: any) {
    return this.tokenAuth.refreshToken(req.user);
  }

  async authGoogle() {}

  async registerGoogle(req: any) {
    try {
      const access = await this.authRepository.create({
        mail: req.user.email,
        oauth: AuthProvider.Google,
      });

      return this.userRepository.create({
        name: req.user.name,
        auth: access._id,
      });
    } catch (error) {
      return error;
    }
  }

  async loginGoogle(req: any) {
    try {
      const access = await this.authRepository.findUserByMail(req.user.email);

      if (!access) {
        return null;
      }

      return this.userRepository.findOne({ auth: access._id });
    } catch (error) {
      return error;
    }
  }

  async googleAuthCallback(req: any, res: Response) {
    try {
      let user = await this.loginGoogle(req);

      if (!user) {
        user = await this.registerGoogle(req);
      }

      const token = await this.tokenService.createToken({
        id: user._id.toString(),
        username: `${req.user.firstName}`,
      });

      res.cookie('access_token', token, {
        maxAge: MAX_AGE,
        sameSite: 'lax',
        secure: false,
      });

      res.redirect(this.configService.get('googleOauth.redirectUrl'));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send('Google authentication failed');
    }
  }

  changePassword() {
    return '';
  }

  forgotPassword() {
    return;
  }

  logout() {
    return { access_token: '' };
  }
}
