export interface User {
  id: string;
  email: string;
  password?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarImage?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
  properties: Property[];
  savedProperties: SavedProperty[];
  chats: Chat[];
  refreshTokens: RefreshToken[];
}

export interface RefreshToken {
  id: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
}

export interface Property {
  id: string;
  images: string[];
  title: string;
  desc: string;
  price: number;
  address: string;
  postcode: string;
  city: string;
  bedroom: number;
  bathroom: number;
  latitude: string;
  longitude: string;
  listingType: ListingType;
  propertyType: PropertyType;
  furnishedType?: FurnishedType;
  pet?: boolean;
  garden?: boolean;
  balcony?: boolean;
  parking?: boolean;
  size?: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  userId: string;
  savedProperties: SavedProperty[];
}

export interface QueryParams {
  listingType: ListingType;
  city: string;
  propertyType: PropertyType;
  minPrice: string;
  maxPrice: string;
  bedroom: string;
  furnishedType: FurnishedType;
  garden?: boolean;
  balcony?: boolean;
  parking?: boolean;
}

export enum ListingType {
  ForSale = "ForSale",
  ToRent = "ToRent",
  Sold = "Sold",
  Rented = "Rented"
}

export enum PropertyType {
  House = "House",
  Flat = "Flat",
  Apartment = "Apartment",
  Studio = "Studio",
  Bungalow = "Bungalow",
  Land = "Land"
}

export enum FurnishedType {
  Furnished = "Furnished",
  PartFurnished = "Part furnished",
  Unfurnished = "Unfurnished"
}

export interface SavedProperty {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  userId: string;
  property?: Property;
  propertyId?: string;
  isSaved: boolean;
}

export interface Chat {
  id: string;
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  messages: Message[];
}

export interface Message {
  id: string;
  text: string;
  seenBy: string[];
  createdAt: string;
  updatedAt: string;
  chat: Chat;
  chatId: string;
  sender: User;
  senderId: string;
}

export interface ErrorResponse {
  error?: string;
  message?: string;
}
