import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { OfferLimits } from './offer-limits.enum.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const offerName = getRandomItem(this.mockData.offerNames);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.images);
    const isPremium = generateRandomValue(0, 1) === 1;
    const rating = generateRandomValue(OfferLimits.MIN_RATING, OfferLimits.MAX_RATING);
    const type = getRandomItem(this.mockData.roomTypes);
    const roomsNumber = generateRandomValue(OfferLimits.MIN_ROOMS, OfferLimits.MAX_ROOMS);
    const guests = generateRandomValue(OfferLimits.MIN_GUESTS, OfferLimits.MAX_GUESTS);
    const price = generateRandomValue(OfferLimits.MIN_PRICE, OfferLimits.MAX_PRICE);
    const services = getRandomItems(this.mockData.services);
    const author = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const password = getRandomItem(this.mockData.passwords);
    const avatarPath = getRandomItem(this.mockData.avatarPaths);
    const userType = getRandomItem(this.mockData.userTypes);
    const commentsNumber = generateRandomValue(OfferLimits.MIN_COMMENT_COUNT, OfferLimits.MAX_COMMENT_COUNT);
    const location = getRandomItem(this.mockData.locations);
    const longitude = location.longitude.toFixed(6);
    const latitude = location.latitude.toFixed(6);

    const publicationDate = dayjs().subtract(generateRandomValue(OfferLimits.FIRST_WEEK_DAY, OfferLimits.LAST_WEEK_DAY), 'day').toISOString();

    return [
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
      author,
      email,
      password,
      avatarPath,
      userType,
      commentsNumber,
      longitude,
      latitude
    ].join('\t');
  }
}
