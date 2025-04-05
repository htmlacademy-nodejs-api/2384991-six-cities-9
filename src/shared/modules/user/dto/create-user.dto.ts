import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';
import { CreateUserValidationMessage } from './create-user.messages.js';

export class CreateUserDTO {
  @IsEmail({}, { message: CreateUserValidationMessage.email.isEmail })
  public email: string;

  @IsString({ message: CreateUserValidationMessage.name.required })
  @MinLength(1, { message: CreateUserValidationMessage.name.lengthField })
  @MaxLength(15, { message: CreateUserValidationMessage.name.lengthField })
  public name: string;

  @IsString({ message: CreateUserValidationMessage.password.required })
  @MinLength(6, { message: CreateUserValidationMessage.password.lengthField })
  @MaxLength(15, { message: CreateUserValidationMessage.password.lengthField })
  public password: string;

  @IsIn(['standard', 'pro'], { message: CreateUserValidationMessage.userType.isUserType })
  public userType: 'standard' | 'pro';
}
