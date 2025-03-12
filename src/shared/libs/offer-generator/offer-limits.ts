export const OFFER_LIMITS = {
  PRICE: { MIN: 100, MAX: 100000 },
  ROOMS: { MIN: 1, MAX: 8 },
  GUESTS: { MIN: 1, MAX: 10 },
  RATING: { MIN: 1, MAX: 5 },
  COMMENTS: { MIN: 0, MAX: 50 },
  WEEK_DAYS: { FIRST: 1, LAST: 7 }
} as const;
