import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AuthDocument, Auth } from './auth.entity';
import { BaseRepository } from 'src/lib/BaseRepository';
import { NotFoundException } from '@nestjs/common';
import { LoginDTO } from '../dto/login-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository extends BaseRepository<AuthDocument> {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument>,
  ) {
    super(authModel, Auth.name, ['roles']);
  }

  async failIfExist(filter: FilterQuery<AuthDocument>): Promise<AuthDocument> {
    const document = await this.authModel.findOne(filter).exec();

    if (document) {
      throw new NotFoundException(`${this.entityName} already exist`);
    }
    return document;
  }

  async findLogin(loginDTO: LoginDTO) {
    const { username, password } = loginDTO;

    const access = await this.findOneOrFail({
      username,
    });

    const hash = await bcrypt.compare(password, access.password);

    if (!hash) {
      throw new NotFoundException('the password is incorrect');
    }

    return access;
  }

  async findUserByMail(mail: string) {
    const auth = await this.findOne({ mail });

    if (!auth) {
      return null;
    }

    return auth;
  }
}
