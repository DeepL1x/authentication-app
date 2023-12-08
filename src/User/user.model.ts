import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  avatar: string;

  @Prop()
  imgS: string

  @Prop()
  imgM: string

  @Prop()
  imgL: string

  @Prop({ required: true, select: false })
  verificationToken: string;

  @Prop({ default: false })
  emailVerified: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
