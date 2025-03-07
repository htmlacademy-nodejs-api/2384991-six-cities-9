import dayjs from "dayjs";

import { OfferGenerator } from "./offer-generator.interface.js";
import { MockServerData, Offer } from "../../types/index.js";
import { generateRandomValue, getRandomItem, getRandomItems } from "../../helpers/common.js";

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const MIN_ROOMS_NUMBER = 1;
const MAX_ROOMS_NUMBER = 8;
const MIN_GUESTS_NUMBER = 1;
const MAX_GUESTS_NUMBER = 10;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_COMMENT_COUNT = 0;
const MAX_COMMENT_COUNT = 50;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const offerName = getRandomItem(this.mockData.offerNames);
    const description = getRandomItem(this.mockData.descriptions);
    const cities = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.images);
    const isPremium = generateRandomValue(0, 1) === 1;
    const isFavorite = generateRandomValue(0, 1) === 1;
    const rating = generateRandomValue(MIN_RATING, MAX_RATING);
    const type = getRandomItem(this.mockData.roomTypes);
    const roomsNumber = generateRandomValue(MIN_ROOMS_NUMBER, MAX_ROOMS_NUMBER);
    const guests = generateRandomValue(MIN_GUESTS_NUMBER, MAX_GUESTS_NUMBER);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const services = getRandomItems(this.mockData.services);
    const author = getRandomItem(this.mockData.users);
    const commentsNumber = generateRandomValue(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT);
    
    const publicationDate = dayjs()
    .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
    .toISOString();
    
    return [
      offerName,
      description,
      publicationDate,
      cities,
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
      commentsNumber
    ].join('\t');
  }
}
