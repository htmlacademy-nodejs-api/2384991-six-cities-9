import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity, CreateOfferDTO } from './index.js';
import { DocumentExists } from '../../libs/rest/types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findOfferList(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  updateById(offerId: string, dto: CreateOfferDTO): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  updateRatingAndCommentCount(offerId: string, rating: number, commentCount: number): Promise<void>;
  findDuplicate(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity> | null>;
}
