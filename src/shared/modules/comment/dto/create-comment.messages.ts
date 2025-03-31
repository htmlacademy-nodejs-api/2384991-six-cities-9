export const CreateCommentValidationMessage = {
  text: {
    invalidFormat: 'text is required',
    minLength: 'Minimum text length must be 5',
    maxLength: 'Maximum text length must be 1024',
  },
  rating: {
    invalidFormat: 'rating must be a number between 1 and 5',
    isNumber: 'rating must be a number',
  },
  offerId: {
    invalidId: 'offerId field must be a valid id',
  },
  authorId: {
    invalidId: 'authorId field must be a valid id',
  },
} as const;
