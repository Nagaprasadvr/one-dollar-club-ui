import { PoolState } from "@/sdk/types";

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

export type PositionInputData = {
  tokenName: string;
  positionType: "long" | "short";
  leverage: number;
  pointsAllocated: number | string;
  entryPrice: number;
  tokenMint: string;
};

export type PositionData = {
  pubkey: string;
  tokenName: string;
  tokenMint: string;
  entryPrice: number;
  leverage: number;
  pointsAllocated: number;
  positionType: "long" | "short";
  liquidationPrice: number;
};

export type LeaderBoardHistory = {
  pubkey: string;
  pointsAllocated: number;
  poolId: string;
  finalPoints: number;
  top3Positions: string;
  rank: number;
  date: string;
};

export type LeaderBoardDataType = {
  pubkey: string;
  pointsAllocated: number;
  poolId: string;
  finalPoints: number;
  top3Positions: string;
};

export type ExtendedLeaderBoardDataType = LeaderBoardDataType & {
  id: number;
};

export type ExtendedLeaderBoardHistory = LeaderBoardHistory & {
  id: number;
};

export type PoolConfigAccount = {
  poolState: PoolState;
  poolAddress: string;
  poolAuthority: string;
  poolActiveMint: string;
  poolDepositPerUser: number;
  poolRoundWinAllocation: number;
  squadsAuthorityPubkey: string;
  poolBalance: number;
  poolDepositsPaused: boolean;
};
