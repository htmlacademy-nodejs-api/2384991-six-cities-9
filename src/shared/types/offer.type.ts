import { User, RoomType, City, Services } from './index.js';

export type Offer = {
	offerName: string;
	description: string;
	publicationDate: Date;
	city: City;
	previewImage: string;
	images: string[];
	isPremium: boolean;
	isFavorite: boolean;
	rating: number;
	type: RoomType;
	roomsNumber: number;
	guests: number;
	price: number;
	services: Services[];
	author: User;
	commentsNumber: number;
	location: { longitude: number; latitude: number };
};
