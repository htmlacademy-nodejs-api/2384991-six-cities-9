import { User, RoomType, City } from './index.js';


export type Offer = {
	offerName: string;
	description: string;
	publicationDate: Date;
	city: City;
	previewImage: string;
	images: string[];
	premium: boolean;
	favorite: boolean;
	rating: number;
	type: string;
	rooms: RoomType;
	guests: number;
	price: number;
	services: string[];
	host: User;
	commentsNumber: number;
	langitude: string;
	latitude: string;
};