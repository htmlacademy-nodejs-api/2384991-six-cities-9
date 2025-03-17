export type User = {
	name: string;
	email: string;
	avatarPath: string;
	userType: 'standart' | 'pro';
}

export type UserForMocks = User & {
  password: string;
};
