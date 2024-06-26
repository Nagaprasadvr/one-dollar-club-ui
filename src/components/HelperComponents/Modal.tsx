import { Modal as MuiModal, useMediaQuery } from "@mui/material";
import React, { useRef } from "react";
export const Modal = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactElement;
}) => {
  const modalRef = useRef(null);
  const smallScreen = useMediaQuery("(max-width:600px)");
  return (
    <MuiModal
      ref={modalRef}
      open={isOpen}
      closeAfterTransition
      aria-describedby="modal-modal-description"
      aria-labelledby="modal-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: smallScreen ? "start" : "center",
        minWidth: "500px",
        minHeight: "600px",
        gap: "16px",
        backdropFilter: "blur(10px)",
      }}
    >
      {children}
    </MuiModal>
  );
};
