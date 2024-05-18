export interface TokenPrice {
  name: string;
  price: number;
}

export type TokenPriceHistory = {
  address: string;
  data: BirdeyePriceHistory[];
};

export interface BirdeyeTokenPriceData {
  address: string;
  value: number;
  updateUnixTime: number;
  updateHumanTime: string;
  priceChange24h: number;
}

export type BirdeyePriceHistory = {
  unixTime: number;
  value: number;
};
