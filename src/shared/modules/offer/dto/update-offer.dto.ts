import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUpdateOfferMessage } from './update-offer.messages.js';
import { City, RoomType, Services } from '../../../types/index.js';

export class LocationDTO {
  @IsOptional()
  @IsNumber({}, { message: CreateUpdateOfferMessage.location.latitude })
  @Min(-90, { message: CreateUpdateOfferMessage.location.latitude })
  @Max(90, { message: CreateUpdateOfferMessage.location.latitude })
  public latitude: number;

  @IsOptional()
  @IsNumber({}, { message: CreateUpdateOfferMessage.location.longitude })
  @Min(-180, { message: CreateUpdateOfferMessage.location.longitude })
  @Max(180, { message: CreateUpdateOfferMessage.location.longitude })
  public longitude: number;
}

export class UpdateOfferDTO {
  @IsOptional()
  @MinLength(10, { message: CreateUpdateOfferMessage.offerName.minLength })
  @MaxLength(100, { message: CreateUpdateOfferMessage.offerName.maxLength })
  public offerName?: string;

  @IsOptional()
  @MinLength(20, { message: CreateUpdateOfferMessage.description.minLength })
  @MaxLength(1024, { message: CreateUpdateOfferMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: CreateUpdateOfferMessage.publicationDate.invalidFormat })
  public publicationDate?: Date;

  @IsOptional()
  @IsEnum(City, { message: CreateUpdateOfferMessage.city.isEnum })
  public city?: string;

  @IsOptional()
  @IsString({ message: CreateUpdateOfferMessage.previewImage.isNotEmpty })
  @MinLength(5, { message: CreateUpdateOfferMessage.previewImage.isNotEmpty })
  @IsUrl({}, { message: CreateUpdateOfferMessage.previewImage.isUrl })
  public previewImage: string;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.images.isArray })
  @ArrayMinSize(6, { message: CreateUpdateOfferMessage.images.minSize })
  @ArrayMaxSize(6, { message: CreateUpdateOfferMessage.images.maxSize })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: CreateUpdateOfferMessage.isPremium.isBoolean })
  public isPremium?: boolean;

  @IsOptional()
  @IsNumber({}, { message: CreateUpdateOfferMessage.rating.isNumber })
  @Min(1, { message: CreateUpdateOfferMessage.rating.minValue })
  @Max(5, { message: CreateUpdateOfferMessage.rating.maxValue })
  public rating?: number;

  @IsOptional()
  @IsEnum(RoomType, { message: CreateUpdateOfferMessage.type.isEnum })
  public type?: RoomType;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.roomsNumber.isInt })
  @Min(1, { message: CreateUpdateOfferMessage.roomsNumber.minValue })
  @Max(8, { message: CreateUpdateOfferMessage.roomsNumber.maxValue })
  public roomsNumber?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.guests.isInt })
  @Min(1, { message: CreateUpdateOfferMessage.guests.minValue })
  @Max(10, { message: CreateUpdateOfferMessage.guests.maxValue })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.price.invalidFormat })
  @Min(100, { message: CreateUpdateOfferMessage.price.minValue })
  @Max(200000, { message: CreateUpdateOfferMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.services.isArray })
  @IsEnum(Services, {
    each: true,
    message: CreateUpdateOfferMessage.services.isEnum
  })
  public services?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDTO)
  public location?: LocationDTO;
}
