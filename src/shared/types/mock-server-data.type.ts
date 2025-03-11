export type Location = {
  longitude: number;
  latitude: number;
};

export type MockServerData = {
  offerNames: string[];
  descriptions: string[];
  cities: string[];
  previewImages: string[];
  images: string[];
  roomTypes: string[];
  services: string[];
  users: string[];
  emails: string[];
  passwords: string[];
  avatarPaths: string[];
  userTypes: string[];
  locations: Location[];
};
