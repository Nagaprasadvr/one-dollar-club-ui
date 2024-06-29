import { Box, SxProps, useMediaQuery } from "@mui/material";
import { Card } from "../HelperComponents/Card";
import Image from "next/image";
import { TextWithValue } from "../HelperComponents/TextWithValue";

interface NFTPointsCardProps {
  nftName: string;
  nftSymbol: string;
  nftImage: string;
  nftTotalPoints: number;
  topGainer: string;
  top3Positions: string;
}

export const NFTPointsCard = ({
  nftName,
  nftSymbol,
  nftImage,
  nftTotalPoints,
  topGainer,
  top3Positions,
}: NFTPointsCardProps) => {
  const smallScreen = useMediaQuery("(max-width:500px)");
  return (
    <Card
      sx={{
        maxWidth: "430px",
        margin: "10px",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: smallScreen ? "column" : "row",
          gap: "24px",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Image
          style={{
            border: "1px solid white",
          }}
          src={nftImage}
          alt={nftName}
          height={80}
          width={80}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto",
            rowGap: "20px",
            columnGap: "20px",
            width: "100%",
            flexWrap: "wrap",
            overflow: "scroll",
          }}
        >
          <TextWithValue text={"NFT Name"} value={nftName} />
          <TextWithValue text="NFT Symbol" value={nftSymbol} />
          <TextWithValue
            text={"Total Points"}
            value={nftTotalPoints.toLocaleString()}
          />
          <TextWithValue text={"Top Gainer"} value={topGainer} />
          <TextWithValue text={"Top 3 Positions"} value={top3Positions} />
        </Box>
      </Box>
    </Card>
  );
};
