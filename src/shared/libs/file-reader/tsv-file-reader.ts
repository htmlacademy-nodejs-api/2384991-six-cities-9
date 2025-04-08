import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer, City, RoomType, UserForMocks, Services } from '../../types/index.js';

const DELIMITER = ',';

export class TSVFileReader extends EventEmitter implements FileReader {
  private readonly CHUNK_SIZE = 16384;

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

    const parsedAuthor: UserForMocks = {
      name,
      email,
      avatarPath: avatarPath,
      password,
      userType: userType as 'standard' | 'pro'
    };

    return {
      offerName,
      description,
      publicationDate: this.parseDate(publicationDate),
      city: City[city as keyof typeof City],
      previewImage,
      images: this.parseArray(images),
      isPremium: this.parseBoolean(isPremium),
      rating: this.parseNumber(rating),
      type: RoomType[type.toLowerCase() as keyof typeof RoomType],
      roomsNumber: this.parseNumber(roomsNumber),
      guests: this.parseNumber(guests),
      price: this.parseNumber(price),
      services: this.parseArray(services).map((service) => Services[service as keyof typeof Services]),
      user: parsedAuthor,
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
    let hasNewLine = true;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while (hasNewLine) {
        nextLinePosition = remainingData.indexOf('\n');
        if (nextLinePosition < 0) {
          hasNewLine = false;
          continue;
        }

        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
