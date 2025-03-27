// offer.rdo.ts
import { Expose, Type } from 'class-transformer';

class LocationRdo {
  @Expose()
    latitude: number;

  @Expose()
    longitude: number;
}

class AuthorRdo {
  @Expose({ name: '_id' })
    id: string;
}

export class OfferRdo {
  @Expose()
    offerName: string;

  @Expose()
    description: string;

  @Expose()
    publicationDate: string;

  @Expose()
    city: string;

  @Expose()
    previewImage: string;

  @Expose()
    images: string[];

  @Expose()
    isPremium: boolean;

  @Expose()
    rating: number;

  @Expose()
    type: string;

  @Expose()
    roomsNumber: number;

  @Expose()
    guests: number;

  @Expose()
    price: number;

  @Expose()
    services: string[];

  @Expose()
  @Type(() => AuthorRdo)
    authorId: AuthorRdo;

  @Expose()
    commentCount: number;

  @Expose()
  @Type(() => LocationRdo)
    location: LocationRdo;
}
