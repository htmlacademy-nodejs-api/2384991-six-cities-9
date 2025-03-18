export type User = {
	name: string;
	email: string;
	avatarPath: string;
	userType: 'standard' | 'pro';
}

export type UserForMocks = User & {
  password: string;
};
