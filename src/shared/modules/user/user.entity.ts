import { defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { User } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: 2 })
  public name: string;

  @prop({
    required: true,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  })
  public email: string;

  @prop({ required: true, minlength: 5 })
  public avatarPath: string;

  @prop({ required: true, minlength: 6 })
  public password: string;

  @prop({
    required: true,
    enum: ['standart', 'pro'],
    default: 'standart',
  })
  public userType: 'standart' | 'pro';
}

export const UserModel = getModelForClass(UserEntity);
