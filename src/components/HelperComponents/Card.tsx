import { Box, SxProps } from "@mui/material";
import { PropsWithChildren } from "react";

interface CardProps {
  children: React.ReactNode;
  sx?: SxProps;
}

export const Card = ({ children, sx }: PropsWithChildren<CardProps>) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "14px",
        gap: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        border: "1px solid white",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
