import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsString,
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

export class LocationDto {
  @IsNumber()
    latitude: number;

  @IsNumber()
    longitude: number;
}

export class CreateOfferDto {
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

  @IsString()
  @MinLength(5)
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.images.isArray })
  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.minSize })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.maxSize })
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsNumber()
  @Min(1)
  @Max(5)
  public rating: number;

  @IsEnum(RoomType, { message: CreateOfferValidationMessage.type.isEnum })
  public type: RoomType;

  @IsInt()
  @Min(1)
  @Max(8)
  public roomsNumber: number;

  @IsInt()
  @Min(1)
  @Max(10)
  public guests: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(200000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsArray()
  @IsEnum(Services, { each: true })
  public services: Services[];

  @IsMongoId({ message: CreateOfferValidationMessage.authorId.invalidId })
  public authorId: string;

  @IsInt()
  @Min(0)
  public commentsNumber: number;

  @ValidateNested()
  @Type(() => LocationDto)
  public location: LocationDto;
}
