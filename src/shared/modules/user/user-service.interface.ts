import { DocumentType } from '@typegoose/typegoose';
import { UserEntity, CreateUserDto } from './index.js';
import { OfferEntity } from '../offer/index.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findFavorites(authorId: string): Promise<DocumentType<OfferEntity>[]>;
  addFavorite(authorId: string, offerId: string): Promise<void>;
  removeFavorite(authorId: string, offerId: string): Promise<void>;
  updateById(id: string, dto: CreateUserDto): Promise<DocumentType<UserEntity> | null>;
}
