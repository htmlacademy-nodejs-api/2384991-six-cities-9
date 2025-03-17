import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity, CreateOfferDto } from './index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  update(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addFavorite(userId: string, offerId: string): Promise<void>;
  removeFavorite(userId: string, offerId: string): Promise<void>;
}
