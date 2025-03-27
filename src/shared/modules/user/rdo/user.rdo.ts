import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
    id: string;

  @Expose()
    name: string;

  @Expose()
    email: string;

  @Expose()
    avatarPath: string;

  @Expose()
    userType: 'standard' | 'pro';
}
