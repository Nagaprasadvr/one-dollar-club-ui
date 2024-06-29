import { NFTGatedTokens } from "./constants";
import { NFTPointsData } from "./types";

export const dummyNFTPointsData: NFTPointsData[] = NFTGatedTokens.map(
  (token) => {
    return {
      nftName: token.name,
      top3Positions: "...",
      topGainer: "...",
      totalPoints: 0,
      nftSymbol: token.symbol,
      nftUrl: token.imageUrl,
      collectionAddress: token.collectionAddress,
      totalPlayers: 0,
    };
  }
);
