import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { timestamps: true, collection: 'users' }})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, minlength: 2, default: '' })
  public name: string;

  @prop({
    required: true,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  })
  public email: string;

  @prop({ required: true, minlength: 5 })
  public avatarPath: string;

  @prop({ required: true, minlength: 6, default: '' })
  private password?: string;

  @prop({
    required: true,
    enum: ['standard', 'pro'],
    default: 'standard',
  })
  public userType: 'standard' | 'pro';

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.name = userData.name;
    this.avatarPath = userData.avatarPath;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
