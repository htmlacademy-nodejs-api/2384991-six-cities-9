export type TokenPayload = {
  email: string;
  name: string;
  userType: 'standard' | 'pro';
  id: string;
};