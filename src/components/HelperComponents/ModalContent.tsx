import { Box, SxProps } from "@mui/material";
import React from "react";

interface ModalContentProps {
  sx?: SxProps;
  children: React.ReactNode;
}

export const ModalContent = React.forwardRef(function ModalContent(
  props: ModalContentProps,
  ref: React.Ref<HTMLDivElement>
) {
  const { children, sx } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "black",
        padding: "16px",
        borderRadius: "10px",
        boxShadow: "0px 4px 30px 4px #87cefa",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
});
