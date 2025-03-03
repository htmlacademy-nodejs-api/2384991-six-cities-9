export type User = {
	name: string;
	email: string;
	avatarPath?: string;
	password: string;
	userType: 'standart' | 'pro';
  }