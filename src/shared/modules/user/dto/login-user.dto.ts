import { IsEmail, IsString } from 'class-validator';
import { CreateLoginUserMessage } from './login-user.messages.js';

export class LoginUserDTO {
  @IsEmail({}, { message: CreateLoginUserMessage.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateLoginUserMessage.password.invalidFormat })
  public password: string;
}
