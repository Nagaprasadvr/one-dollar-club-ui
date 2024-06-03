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
  const MODAL_CONTENT_STYLES: SxProps = {
    flex: "1",
    minWidth: "auto",
    width: "100vw",
    height: "100dvh",
    [breakpoints.up("sm")]: {
      borderRadius: "20px",
      maxHeight: "90vh",
      maxWidth: "490px",
    },
    [breakpoints.up("lg")]: {
      display: "flex",
      flexDirection: "column",
      width: "unset",
      height: "unset",
    },
  };

  const { children, sx } = props;
  return (
    //@ts-ignore
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "black",
        padding: "16px",
        borderRadius: "10px",
        boxShadow: "0px 4px 30px 4px #87cefa",
        ...(sx as SxProps),
        ...(MODAL_CONTENT_STYLES as SxProps),
      }}
    >
      {children}
    </Box>
  );
});
