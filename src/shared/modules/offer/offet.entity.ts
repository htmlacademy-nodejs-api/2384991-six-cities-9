import { defaultClasses, prop, getModelForClass } from '@typegoose/typegoose';
import { User, RoomType, City, Services, Offer } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging

export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  @prop({ required: true, minlength: 10, maxlength: 100 })
  public offerName: string;

  @prop({ required: true, minlength: 20, maxlength: 1024 })
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

  @prop({ required: true })
  public author: User;

  @prop({ default: 0 })
  public commentsNumber: number;

  @prop({
    required: true,
    type: () => ({
      longitude: { type: Number, min: -180, max: 180, required: true },
      latitude: { type: Number, min: -90, max: 90, required: true }
    })
  })
  public location: { longitude: number; latitude: number };
}

export const OfferModel = getModelForClass(OfferEntity);
