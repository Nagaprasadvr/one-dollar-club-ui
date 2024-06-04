"use client";
import { CHARCOAL } from "@/utils/constants";
import { Box, Typography, useTheme } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { FooterModal } from "./FooterModal";

const footerContents = [
  "Rules",
  "Steps",
  "Game Time",
  "Prizes and Contributions",
  "Caution",
];

export const Footer = () => {
  const { palette } = useTheme();
  const {
    footerDataToDisplay,
    setFooterDataToDisplay,
    setFooterModalOpen,
    footerModalOpen,
  } = useContext(AppContext);

  const handleClick = (content: string) => {
    setFooterDataToDisplay(content);
    setFooterModalOpen(true);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60px",
        borderTop: `1px solid ${CHARCOAL}`,
        overflowX: "auto",
        width: "100%",
        left: 0,
        bottom: 0,
        position: "fixed",
        backdropFilter: "blur(5px)",
        backgroundColor: "transparent",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "30px",
          width: "90%",
          paddingLeft: "20px",
          paddingRight: "20px",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "10px",
        }}
      >
        {footerContents.map((content) => (
          <Typography
            key={content}
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              paddingLeft: "10px",
              paddingRight: "10px",
              ":hover": {
                color: palette.primary.main,
              },
              textWrap: "nowrap",
            }}
            onClick={() => handleClick(content)}
          >
            {content}
          </Typography>
        ))}
      </Box>
      {footerModalOpen && footerDataToDisplay && (
        <FooterModal content={footerDataToDisplay} />
      )}
    </Box>
  );
};
