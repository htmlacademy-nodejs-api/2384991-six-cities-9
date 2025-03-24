import { DocumentType } from '@typegoose/typegoose';
import { UserEntity, CreateUserDto } from './index.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}
/* findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>; 

  addFavorite(userId: string, offerId: string): Promise<void>;
  removeFavorite(userId: string, offerId: string): Promise<void>;
*/