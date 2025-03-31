import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose()
    text: string;

  @Expose({ name: 'createdAt'})
    publicationDate: string;

  @Expose()
    rating: number;

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public author: UserRdo;
}
