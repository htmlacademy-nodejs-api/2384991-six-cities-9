export class CreateUserDto {
  public email: string;
  public name: string;
  public avatarPath: string;
  public password: string;
  public userType: 'standard' | 'pro';
}
