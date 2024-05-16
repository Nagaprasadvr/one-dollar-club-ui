import { API_BASE_URL } from "@/utils/constants";
import { PublicKey } from "@solana/web3.js";

export type PositionType = {
  pubkey: string;
  timeStamp: number;
  tokenName: string;
  tokenMint: string;
  entryPrice: number;
  leverage: number;
  pointsAllocated: number;
  poolId: string;
  positionType: "long" | "short";
  liquidationPrice: number;
};

export class Position {
  pubkey: string;
  timeStamp: number;
  tokenName: string;
  tokenMint: string;
  entryPrice: number;
  leverage: number;
  pointsAllocated: number;
  poolId: string;
  positionType: "long" | "short";
  liquidationPrice: number;

  constructor(public data: PositionType) {
    this.pubkey = data.pubkey;
    this.timeStamp = data.timeStamp;
    this.tokenName = data.tokenName;
    this.tokenMint = data.tokenMint;
    this.entryPrice = data.entryPrice;
    this.leverage = data.leverage;
    this.pointsAllocated = data.pointsAllocated;
    this.poolId = data.poolId;
    this.positionType = data.positionType;
    this.liquidationPrice = data.liquidationPrice;
  }

  static async fetchMultiplePositions(pubkey: string): Promise<Position[]> {
    try {
      const isValidPubkey = PublicKey.isOnCurve(pubkey);
      if (!isValidPubkey) {
        throw new Error("Invalid public key");
      }
      const response = await fetch(
        `${API_BASE_URL}/poolGetPositions?pubkey=${pubkey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseJson = await response.json();

      const positionData: PositionType[] = responseJson.data;
      const positions = positionData.map((position) => new Position(position));
      return positions;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
