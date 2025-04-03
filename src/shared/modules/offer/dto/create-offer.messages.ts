export const CreateOfferValidationMessage = {
  offerName: {
    minLength: 'Minimum offerName length must be 10',
    maxLength: 'Maximum offerName length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  publicationDate: {
    invalidFormat: 'publicationDate must be a valid ISO date',
  },
  city: {
    isEnum: 'City must be a valid enum value',
  },
  previewImage: {
    isUrl: 'previewImage must be a valid URL',
    isNotEmpty: 'previewImage should not be empty',
  },
  images: {
    minSize: 'At least 6 images are required',
    maxSize: 'No more than 6 images are allowed',
    isArray: 'images must be an array',
    isUrl: 'Each image in images must be a valid URL',
  },
  isPremium: {
    isBoolean: 'isPremium must be a boolean',
  },
  rating: {
    isNumber: 'rating must be a number',
    minValue: 'rating must be at least 1',
    maxValue: 'rating must be at most 5',
  },
  type: {
    isEnum: 'type must be one of the allowed room types',
  },
  roomsNumber: {
    isInt: 'roomsNumber must be an integer',
    minValue: 'roomsNumber must be at least 1',
    maxValue: 'roomsNumber must be at most 8',
  },
  guests: {
    isInt: 'guests must be an integer',
    minValue: 'guests must be at least 1',
    maxValue: 'guests must be at most 10',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 200000',
  },
  services: {
    isArray: 'services must be an array',
    isEnum: 'Each service must be a valid enum value',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  location: {
    latitude: 'latitude must be a valid number between -90 and 90',
    longitude: 'longitude must be a valid number between -180 and 180',
  },
} as const;
