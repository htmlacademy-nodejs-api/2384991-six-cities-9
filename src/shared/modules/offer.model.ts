import { Schema, Document, model } from 'mongoose';
import { Offer, City, RoomType, Services } from '../types/index.js';

export interface OfferDocument extends Offer, Document {
  createdAt: Date,
  updatedAt: Date,
}

const offerSchema = new Schema({
  offerName: {
    type: String,
    required: true,
    minlength: [10, 'Offer name must be at least 5 characters long'],
    maxlength: [100, 'Offer name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: true,
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [1024, 'Description cannot exceed 1024 characters']
  },
  publicationDate: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    enum: Object.values(City),
    required: true
  },
  previewImage: {
    type: String,
    required: true,
    minlength: [5, 'Preview image path must be at least 5 characters']
  },
  images: {
    type: [String],
    validate: {
      validator: (arr: string[]) => arr.length === 6,
      message: 'Exactly 6 images are required'
    },
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false,
    required: true
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    required: true
  },
  type: {
    type: String,
    enum: Object.values(RoomType),
    required: true
  },
  roomsNumber: {
    type: Number,
    min: [1, 'There must be at least 1 room'],
    max: [8, 'No more than 8 rooms allowed'],
    required: true
  },
  guests: {
    type: Number,
    min: [1, 'At least 1 guest allowed'],
    max: [10, 'No more than 10 guests allowed'],
    required: true
  },
  price: {
    type: Number,
    min: [1, 'Price must be at least 1'],
    max: [100000, 'Price cannot exceed 100000'],
    required: true
  },
  services: {
    type: [String],
    enum: Object.values(Services),
    required: true
  },
  author: {
    type: Object,
    required: true
  },
  commentsNumber: {
    type: Number,
    default: 0
  },
  location: {
    longitude: {
      type: Number,
      required: true,
      min: [-180, 'Longitude must be >= -180'],
      max: [180, 'Longitude must be <= 180']
    },
    latitude: {
      type: Number,
      required: true,
      min: [-90, 'Latitude must be >= -90'],
      max: [90, 'Latitude must be <= 90']
    }
  }
}, { timestamps: true });

export const OfferModel = model<OfferDocument>('Offer', offerSchema);
