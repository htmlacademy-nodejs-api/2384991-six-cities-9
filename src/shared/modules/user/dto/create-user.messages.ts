export const CreateUserValidationMessage = {
  email: {
    required: 'Email is required',
    isEmail: 'Email must be a valid email',
  },
  name: {
    required: 'Name is required',
    lengthField: 'min length is 1, max is 15',
  },
  avatarPath: {
    required: 'Avatar path is required',
  },
  password: {
    required: 'Password is required',
    lengthField: 'min length is 6, max is 15',
  },
  userType: {
    required: 'User type is required',
    isUserType: 'User type must be "standard" or "pro"',
  },
} as const;

