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
        height: "100px",
        borderTop: `1px solid ${CHARCOAL}`,
        overflowX: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "30px",
          width: "70%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {footerContents.map((content) => (
          <Typography
            key={content}
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
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
