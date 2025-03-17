export class CreateOfferDto {
  public offerName: string;
  public description: string;
  public publicationDate: Date;
  public city: string;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public rating: number;
  public type: string;
  public roomsNumber: number;
  public guests: number;
  public price: number;
  public services: string[];
  public author: string;
  public commentsNumber: number;
  public location: {
    latitude: number;
    longitude: number;
  };
}
