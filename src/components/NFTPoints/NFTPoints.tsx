import { dummyNFTPointsData } from "@/utils/dummyData";
import { NFTPointsData } from "@/utils/types";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { NFTPointsCard } from "./NFTPointsCard";
import { useContext, useMemo } from "react";
import { AppContext } from "../Context/AppContext";
import { NFTGatedTokens } from "@/utils/constants";

export const NFTPoints = () => {
  const dynamicScreen = useMediaQuery("(max-width:1000px)");
  const { nftPointsData } = useContext(AppContext);

  const memoizedNFTPointsData = useMemo(() => {
    if (!nftPointsData || nftPointsData.length === 0) return dummyNFTPointsData;
    if (nftPointsData.length === NFTGatedTokens.length) return nftPointsData;
    const extendedNFTPointsData = NFTGatedTokens.map((token) => {
      const nftData = nftPointsData.find(
        (nftData) => nftData.nftName === token.name
      );
      if (nftData) return nftData;
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
    });
    return extendedNFTPointsData;
  }, [nftPointsData]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        NFT stats
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: dynamicScreen ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          padding: "10px",
          width: "100%",
        }}
      >
        {memoizedNFTPointsData.map((nftData: NFTPointsData) => (
          <NFTPointsCard
            key={nftData.nftName}
            nftName={nftData.nftName}
            nftSymbol={nftData.nftSymbol}
            nftImage={nftData.nftUrl}
            nftTotalPoints={nftData.totalPoints}
            topGainer={nftData.topGainer}
            top3Positions={nftData.top3Positions}
            totalPlayers={nftData.totalPlayers}
          />
        ))}
      </Box>
    </Box>
  );
};
