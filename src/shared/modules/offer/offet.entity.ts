import { defaultClasses, prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { RoomType, City, Services } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({ schemaOptions: { timestamps: true, collection: 'offers' }})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, minlength: 10, maxlength: 100, trim: true })
  public offerName: string;

  @prop({ required: true, minlength: 20, maxlength: 1024, trim: true })
  public description: string;

  @prop({ required: true })
  public publicationDate: Date;

  @prop({ required: true, enum: City })
  public city: City;

  @prop({ required: true, minlength: 5 })
  public previewImage: string;

  @prop({
    required: true,
    type: () => [String],
    validate: {
      validator: (arr: string[]) => arr.length === 6,
      message: 'Exactly 6 images are required'
    }
  })
  public images: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true, min: 1, max: 5 })
  public rating: number;

  @prop({ required: true, enum: RoomType })
  public type: RoomType;

  @prop({ required: true, min: 1, max: 8 })
  public roomsNumber: number;

  @prop({ required: true, min: 1, max: 10 })
  public guests: number;

  @prop({ required: true, min: 1, max: 100000 })
  public price: number;

  @prop({
    required: true,
    type: () => [String],
    enum: Services,
  })
  public services: Services[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public authorId: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentsNumber: number;

  @prop({ required: true, type: Object })
  public location: { longitude: number; latitude: number };  

/* prepared for using in the next commits

  constructor(offerData: Offer) {
    super();

    this.offerName = offerData.offerName;
    this.description = offerData.description;
    this.publicationDate = offerData.publicationDate;
    this.city = offerData.city;
    this.previewImage = offerData.previewImage;
    this.images = offerData.images;
    this.isPremium = offerData.isPremium;
    this.rating = offerData.rating;
    this.type = offerData.type;
    this.roomsNumber = offerData.roomsNumber;
    this.guests = offerData.guests;
    this.price = offerData.price;
    this.services = offerData.services;
    this.author = offerData.author;
    this.commentsNumber = offerData.commentsNumber;
    this.location = offerData.location;
  } */
}

export const OfferModel = getModelForClass(OfferEntity);
