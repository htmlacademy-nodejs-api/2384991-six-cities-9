import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

const DEFAULT_OFFER_COUNT = 60;
const PREMIUM_OFFERS_LIMIT = 3;

@injectable()
export class DefaultOfferService implements OfferService {
  constructor (
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.offerName}`);
    const populated = await this.offerModel
      .findById(result._id)
      .populate('authorId')
      .exec();

    if (!populated) {
      throw new Error('Created offer not found after population.');
    }

    return populated;
  }


  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate('authorId')
      .exec();
  }

  public async findOfferList(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this.offerModel
      .find()
      .limit(limit)
      .sort({ createdAt: SortType.Desc })
      .populate('authorId')
      .exec();
  }

  public async updateById(offerId: string, dto: CreateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('authorId')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .populate('authorId')
      .sort({ createdAt: SortType.Desc })
      .limit(PREMIUM_OFFERS_LIMIT)
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return this.offerModel.exists({ _id: documentId }).then((result) => result !== null);
  }

  public async updateRatingAndCommentCount(
    offerId: string,
    rating: number,
    commentCount: number
  ): Promise<void> {
    await this.offerModel.updateOne(
      { _id: offerId },
      {
        $set: {
          rating,
          commentCount
        }
      }
    ).exec();
  }

  public async findDuplicate(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({
      offerName: dto.offerName,
      city: dto.city,
      authorId: dto.authorId
    }).exec();
  }
}
