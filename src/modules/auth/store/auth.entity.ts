import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
  @Prop({ required: false, unique: true })
  mail?: string;

  @Prop()
  phone?: string;

  @Prop()
  username?: string;

  @Prop()
  password: string;

  @Prop({ required: false })
  oauth: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
