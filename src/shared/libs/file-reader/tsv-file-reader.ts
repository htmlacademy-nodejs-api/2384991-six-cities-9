import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer, City, RoomType, User, Services } from '../../types/index.js';

const DELIMITER = ',';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(private readonly filename: string) {
    super();
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
      name,
      email,
      password,
      avatarPath,
      userType,
      commentsNumber,
      longitude,
      latitude
    ] = line.split('\t');

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
      type: RoomType[type.toLowerCase() as keyof typeof RoomType],
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
    return parseFloat(value);
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

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, { highWaterMark: this.CHUNK_SIZE, encoding: 'utf-8' });

    let remainingData = '';
    let nextLinePosition = 0;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }
}
