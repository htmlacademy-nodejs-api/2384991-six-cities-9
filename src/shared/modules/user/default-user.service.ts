import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from '../offer/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);
    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      this.logger.info(`User found: ${dto.email}`);
      return existingUser;
    }

    this.logger.info(`Creating new user: ${dto.email}`);
    return this.create(dto, salt);
  }

  public async updateById(id: string, dto: CreateUserDTO): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(id, dto, {new: true})
      .exec();
  }

  public async addFavorite(authorId: string, offerId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(authorId, {$addToSet: {favorites: offerId}})
      .exec();
  }

  public async removeFavorite(authorId: string, offerId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(authorId, {$pull: {favorites: offerId}})
      .exec();
  }

  public async findFavorites(authorId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findById(authorId).populate('favorites').exec();

    if (!user || !user.favorites) {
      return [];
    }

    return user.favorites as DocumentType<OfferEntity>[];
  }
}
