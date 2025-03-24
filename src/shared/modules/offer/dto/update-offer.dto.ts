import { RoomType } from '../../../types/index.js';

export class UpdateOfferDto {
  public offerName?: string;
  public description?: string;
  public publicationDate?: Date;
  public city?: string;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public rating?: number;
  public type?: RoomType;
  public roomsNumber?: number;
  public guests?: number;
  public price?: number;
  public services?: string[];
  public location?: {
    latitude?: number;
    longitude?: number;
  };
}
