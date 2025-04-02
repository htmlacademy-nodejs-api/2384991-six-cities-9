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
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { City, RoomType, Services } from '../../../types/index.js';

export class LocationDTO {
  @IsNumber({}, { message: CreateOfferValidationMessage.location.latitude })
  @Min(-90, { message: CreateOfferValidationMessage.location.latitude })
  @Max(90, { message: CreateOfferValidationMessage.location.latitude })
  public latitude: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.location.longitude })
  @Min(-180, { message: CreateOfferValidationMessage.location.longitude })
  @Max(180, { message: CreateOfferValidationMessage.location.longitude })
  public longitude: number;
}

export class CreateOfferDTO {
  @MinLength(10, { message: CreateOfferValidationMessage.offerName.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.offerName.maxLength })
  public offerName: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.publicationDate.invalidFormat })
  public publicationDate: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.isEnum })
  public city: City;

  @IsString({ message: CreateOfferValidationMessage.previewImage.isNotEmpty })
  @MinLength(5, { message: CreateOfferValidationMessage.previewImage.isNotEmpty })
  @IsUrl({}, { message: CreateOfferValidationMessage.previewImage.isUrl })
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.isArray })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.minSize })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.maxSize })
  public images: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.isBoolean })
  public isPremium: boolean;

  @IsNumber({}, { message: CreateOfferValidationMessage.rating.isNumber })
  @Min(1, { message: CreateOfferValidationMessage.rating.minValue })
  @Max(5, { message: CreateOfferValidationMessage.rating.maxValue })
  public rating: number;

  @IsEnum(RoomType, { message: CreateOfferValidationMessage.type.isEnum })
  public type: RoomType;

  @IsInt({ message: CreateOfferValidationMessage.roomsNumber.isInt })
  @Min(1, { message: CreateOfferValidationMessage.roomsNumber.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomsNumber.maxValue })
  public roomsNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.guests.isInt })
  @Min(1, { message: CreateOfferValidationMessage.guests.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guests.maxValue })
  public guests: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(200000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.services.isArray })
  @IsEnum(Services, {
    each: true,
    message: CreateOfferValidationMessage.services.isEnum
  })
  public services: Services[];

  public authorId: string;

  @IsInt()
  @Min(0)
  public commentsNumber: number;

  @ValidateNested()
  @Type(() => LocationDTO)
  public location: LocationDTO;
}
