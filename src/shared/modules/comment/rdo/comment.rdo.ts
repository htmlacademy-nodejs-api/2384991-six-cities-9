import { Expose } from 'class-transformer';

export class CommentRdo {
  @Expose()
    text: string;

  @Expose()
    publicationDate: string;

  @Expose()
    rating: number;

  @Expose()
    author: string;
}
