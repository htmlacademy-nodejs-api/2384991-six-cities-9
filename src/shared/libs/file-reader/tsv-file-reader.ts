import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer, City, RoomType, User, Services } from '../../types/index.js';

const DELIMITER = ';';
const RADIX = 10;

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read.');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim())
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
      isPremium,
      isFavorite,
      rating,
      type,
      roomsNumber,
      guests,
      price,
      services,
      author,
      commentsNumber,
      longitude,
      latitude
    ] = line.split('\t');

    const [name, email, avatarPath, password, userType] = author.split(';');

    const parsedAuthor: User = {
      name,
      email,
      avatarPath: avatarPath,
      password,
      userType: userType as 'standart' | 'pro'
    };

    return {
      offerName,
      description,
      publicationDate: this.parseDate(publicationDate),
      city: City[city as keyof typeof City],
      previewImage,
      images: this.parseArray(images),
      isPremium: this.parseBoolean(isPremium),
      isFavorite: this.parseBoolean(isFavorite),
      rating: this.parseNumber(rating),
      type: RoomType[type as keyof typeof RoomType],
      roomsNumber: this.parseNumber(roomsNumber),
      guests: this.parseNumber(guests),
      price: this.parseNumber(price),
      services: this.parseArray(services).map((service) => Services[service as keyof typeof Services]),
      author: parsedAuthor,
      commentsNumber: this.parseNumber(commentsNumber),
      location: {
        longitude: this.parseNumber(longitude),
        latitude: this.parseNumber(latitude)
      }
    };
  }


  private parseArray(value: string): string[] {
    return value.split(DELIMITER);
  }

  private parseNumber(value: string): number {
    return parseInt(value, RADIX);
  }

  private parseBoolean(value: string): boolean {
    return value === 'true';
  }

  private parseDate(value: string): Date {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${value}`);
    }
    return date;
  }

  read(): void {
    this.rawData = readFileSync(this.filename, 'utf-8');
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
