import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  imageProfile?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Auth',
    unique: true,
  })
  auth: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
