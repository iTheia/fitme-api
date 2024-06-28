import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  username?: string;

  @Prop({ required: false })
  imageProfile?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
  })
  auth: 'Auth';
}

export const UserSchema = SchemaFactory.createForClass(User);
