import { Box, SxProps, useTheme } from "@mui/material";
import React from "react";

interface ModalContentProps {
  sx?: SxProps;
  children: React.ReactNode;
}

export const ModalContent = React.forwardRef(function ModalContent(
  props: ModalContentProps,
  ref: React.Ref<HTMLDivElement>
) {
  const { breakpoints } = useTheme();

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
        height: "80vh",
        maxHeight: "700px",
        ...(sx as SxProps),
      }}
    >
      {children}
    </Box>
  );
});
