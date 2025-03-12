import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { OFFER_LIMITS } from './offer-limits.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const offerName = getRandomItem(this.mockData.offerNames);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.images);
    const isPremium = generateRandomValue(0, 1) === 1;
    const rating = generateRandomValue(OFFER_LIMITS.RATING.MIN, OFFER_LIMITS.RATING.MAX);
    const type = getRandomItem(this.mockData.roomTypes);
    const roomsNumber = generateRandomValue(OFFER_LIMITS.ROOMS.MIN, OFFER_LIMITS.ROOMS.MAX);
    const guests = generateRandomValue(OFFER_LIMITS.GUESTS.MIN, OFFER_LIMITS.GUESTS.MAX);
    const price = generateRandomValue(OFFER_LIMITS.PRICE.MIN, OFFER_LIMITS.PRICE.MAX);
    const services = getRandomItems(this.mockData.services);
    const author = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const password = getRandomItem(this.mockData.passwords);
    const avatarPath = getRandomItem(this.mockData.avatarPaths);
    const userType = getRandomItem(this.mockData.userTypes);
    const commentsNumber = generateRandomValue(OFFER_LIMITS.COMMENTS.MIN, OFFER_LIMITS.COMMENTS.MAX);
    const location = getRandomItem(this.mockData.locations);
    const longitude = location.longitude.toFixed(6);
    const latitude = location.latitude.toFixed(6);

    const publicationDate = dayjs().subtract(generateRandomValue(OFFER_LIMITS.WEEK_DAYS.FIRST, OFFER_LIMITS.WEEK_DAYS.LAST), 'day').toISOString();

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
