import { readFileSync } from "node:fs";
import { FileReader } from "./file-reader.interface.js";
import { Offer, City, RoomType, User } from "../../types/index.js";

export class TSVFileReader implements FileReader {
	private rawData = '';

	constructor (
		private readonly filename: string
	) {}

	private validateRawData(): void {
		if (!this.rawData) {
			throw new Error('File was not read.');
		}
	}

	private parseRawDataToOffers(): Offer[] {
		return this.rawData
		  .split('\n')
		  .filter((row) => row.trim().length > 0)
		  .map((line) => this.parseLineToOffer(line));
	}

	private parseLineToOffer(line: string): Offer {
		const [
			offerName,
			description,
			publicationDate,
			city,
			previewImage,
			images,
			premium,
			favorite,
			rating,
			type,
			roomsNumber,
			guests,
			price,
			services,
			host,
			commentsNumber,
			langitude,
			latitude
		] = line.split('\t');

		const [name, email, avatarPath, password, userType] = host.split(';');

		const parsedHost: User = {
			name,
			email,
			avatarPath: avatarPath || undefined,
			password,
			userType: userType as 'standart' | 'pro'
		};

		return { 
			offerName,
			description,
			publicationDate: new Date(publicationDate),
			city: City[city as keyof typeof City],
			previewImage,
			images: this.parseImages(images),
			premium: premium === 'true',
			favorite: favorite === 'true',
			rating: this.parseRating(rating),
			type: RoomType[type as keyof typeof RoomType],
			roomsNumber: this.parseRooms(roomsNumber),
			guests: this.parseGuests(guests),
			price: this.parsePrice(price),
			services: this.parseServices(services),
			host: parsedHost,
			commentsNumber: this.parseCommentsNumber(commentsNumber),
			langitude,
			latitude
		 };
	}

	private parseImages(imagesString: string): string[] {
		return imagesString.split(';');
	}
	
	private parseRating(ratingString: string): number {
		return parseFloat(ratingString);
	}

	private parseRooms(roomsString: string): number {
		return parseInt(roomsString, 10);
	}
	
	private parseGuests(guestsString: string): number {
		return parseInt(guestsString, 10);
	}
	
	private parsePrice(priceString: string): number {
		return parseInt(priceString, 10);
	}
	
	private parseServices(servicesString: string): string[] {
		return servicesString.split(';');
	}
	
	private parseCommentsNumber(commentsString: string): number {
		return parseInt(commentsString, 10);
	}

	read(): void {
		this.rawData = readFileSync(this.filename, 'utf-8');
	}

	public toArray(): Offer[] {
		this.validateRawData();
		return this.parseRawDataToOffers();
	}
};