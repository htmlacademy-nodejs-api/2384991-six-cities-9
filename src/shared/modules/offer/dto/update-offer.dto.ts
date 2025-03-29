import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
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

export class LocationDto {
  @IsOptional()
  @IsNumber()
    latitude: number;

  @IsOptional()
  @IsNumber()
    longitude: number;
}

export class UpdateOfferDto {
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
  @IsString()
  @MinLength(5)
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: CreateUpdateOfferMessage.images.isArray })
  @ArrayMinSize(6, { message: CreateUpdateOfferMessage.images.minSize })
  @ArrayMaxSize(6, { message: CreateUpdateOfferMessage.images.maxSize })
  public images?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  public rating?: number;

  @IsOptional()
  @IsEnum(RoomType, { message: CreateUpdateOfferMessage.type.isEnum })
  public type?: RoomType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  public roomsNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  public guests?: number;

  @IsOptional()
  @IsInt({ message: CreateUpdateOfferMessage.price.invalidFormat })
  @Min(100, { message: CreateUpdateOfferMessage.price.minValue })
  @Max(200000, { message: CreateUpdateOfferMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Services, { each: true })
  public services?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  public location?: LocationDto;
}
