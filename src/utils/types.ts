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

export interface JupTokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId: number;
  coingeckoId: string;
}

export type Project = {
  name: string;
  mint: string;
  logoURI: string;
};
export type EstimatedPriorityFee = {
  microLamports: number;
} | null;
