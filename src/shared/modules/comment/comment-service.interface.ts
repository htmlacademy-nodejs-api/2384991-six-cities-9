import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity, CreateCommentDTO } from './index.js';

export interface CommentService {
  create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>>
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  findByOfferIdWithRating(offerId: string): Promise<{ comments: DocumentType<CommentEntity>[], avgRating: number }>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
