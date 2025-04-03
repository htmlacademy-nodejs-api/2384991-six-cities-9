import { IsMongoId, IsString, MinLength, MaxLength, IsInt } from 'class-validator';
import { CreateCommentValidationMessage } from './create-comment.messages.js';

export class CreateCommentDTO {
  @IsString({ message: CreateCommentValidationMessage.text.invalidFormat })
  @MinLength(5, { message: CreateCommentValidationMessage.text.minLength })
  @MaxLength(1024, { message: CreateCommentValidationMessage.text.maxLength })
  public text: string;

  @IsInt({ message: CreateCommentValidationMessage.rating.invalidFormat })
  public rating: number;

  @IsMongoId({ message: CreateCommentValidationMessage.offerId.invalidId })
  public offerId: string;

  @IsMongoId({ message: CreateCommentValidationMessage.userId.invalidId })
  public userId: string;
}
