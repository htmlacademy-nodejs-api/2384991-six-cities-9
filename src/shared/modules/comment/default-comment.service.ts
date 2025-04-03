import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/index.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { SortType } from '../../types/index.js';

const COMMENT_LIMIT = 50;

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {}

  public async create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${comment}`);

    const offer = await this.offerService.findById(dto.offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    const newCommentCount = offer.commentCount + 1;
    const newRating = ((offer.rating * offer.commentCount) + dto.rating) / newCommentCount;

    await this.offerService.updateRatingAndCommentCount(
      dto.offerId,
      Number(newRating.toFixed(1)),
      newCommentCount
    );

    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    this.logger.info(`Find comments by offerId: ${offerId}`);
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Desc })
      .limit(COMMENT_LIMIT)
      .populate('userId')
      .exec();
  }

  public async findByOfferIdWithRating(offerId: string): Promise<{ comments: DocumentType<CommentEntity>[], avgRating: number }> {
    const comments = await this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Desc })
      .limit(COMMENT_LIMIT)
      .populate('userId')
      .exec();

    const offer = await this.offerService.findById(offerId);
    const avgRating = offer?.rating ?? 0;

    return { comments, avgRating };
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    this.logger.info(`Delete comments by offerId: ${offerId}`);
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
