import { DocumentType } from '@typegoose/typegoose';
import { UserEntity, CreateUserDTO, UpdateUserDTO } from './index.js';
import { OfferEntity } from '../offer/index.js';

export interface UserService {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addFavorite(userId: string, offerId: string): Promise<void>;
  removeFavorite(userId: string, offerId: string): Promise<void>;
  updateById(id: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null>;
}
