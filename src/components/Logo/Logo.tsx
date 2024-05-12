import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export const Logo = ({ size = 25 }: { size?: number }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        borderRadius: "10px",
        padding: "3px",
      }}
    >
      <Typography fontWeight={"700"}>One</Typography>
      <Image src={"/svg/dollar-symbol.svg"} alt="logo" width={30} height={30} />
      <Typography fontWeight={"700"}>Club</Typography>
    </Box>
  );
};
