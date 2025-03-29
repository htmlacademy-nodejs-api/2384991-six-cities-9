import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

class LocationRdo {
  @Expose()
    latitude: number;

  @Expose()
    longitude: number;
}

export class OfferRdo {
  @Expose()
  public offerName: string;

  @Expose()
  public description: string;

  @Expose()
  public publicationDate: string;

  @Expose()
  public city: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: string;

  @Expose()
  public roomsNumber: number;

  @Expose()
  public guests: number;

  @Expose()
  public price: number;

  @Expose()
  public services: string[];

  @Expose({ name: 'authorId' })
  @Type(() => UserRdo)
  public author: UserRdo;

  @Expose()
  public commentCount: number;

  @Expose()
  @Type(() => LocationRdo)
  public location: LocationRdo;
}
