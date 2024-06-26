import { ModalContent } from "@/components/HelperComponents/ModalContent";
import { Modal } from "@/components/HelperComponents/Modal";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import React, { useContext, useEffect } from "react";
import { IconButton, Typography, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../Context/AppContext";
import { useTheme } from "@mui/material";

const ModalContentData = [
  {
    contentName: "Rules",
    contentData: "Dont be a Jackass",
  },
  {
    contentName: "Steps",
    contentData: [
      {
        step: "Connect your wallet and Deposit 40,000 $BONK to get started",
        result: "upon successful deposit, receive 100 points.",
      },
      {
        step: "Pick a set of coins and allocate points",
        result: "set the position of your trade to maximize winning chances.",
      },
      {
        step: "Confirm the positions by signing from the connected wallet",
        result:
          "remember, positions cannot be updated or modified once signed.",
      },
    ],
  },
  {
    contentName: "Game Time",
    contentData: [
      "Each round runs from 1:00 UTC to 23:00 UTC",
      "Depositing ends at 22:00 UTC",
    ],
  },
  {
    contentName: "Prizes and Contributions",
    contentData: [
      "The player with the highest points at 23:00 UTC wins 50% of the pool .",
      "Remaining 50% of the pool is allocated as follows:",
      "25% to support community projects like WildlifeSOS, BonkDAO Treasury, Telega Charity, Fund Public Good projects on Cubik, Buy and Burn $BONK for 30 days.",
      "25% to cover expenses such as platform audits, devs need to eat, marketing, apeing into memecoins, NFT collections or … 🪂[redacted]",
    ],
  },
];

const contentToIndexMap: { [key: string]: string } = {
  Rules: "1",
  Steps: "2",
  "Game Time": "3",
  "Prizes and Contributions": "4",
};

export const FooterModal = ({ content }: { content: string }) => {
  const [value, setValue] = React.useState(contentToIndexMap[content] || "1");
  const { footerModalOpen, setFooterModalOpen } = useContext(AppContext);
  const { palette } = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const mobileScreen = useMediaQuery("(max-width:800px)");

  const RenderTabPanelContent = (contentName: string) => {
    const content = ModalContentData.find(
      (data) => data.contentName === contentName
    );

    if (!content) {
      return <>"No Content Found"</>;
    }
    switch (contentName) {
      case "Rules":
        return (
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "25px",
              width: "100%",
              height: "100%",
              textAlign: "center",
            }}
          >
            {highlightCapitalWords(content.contentData as string)}
          </Typography>
        );
      case "Steps":
        if (typeof content.contentData === "string") return content.contentData;
        return content.contentData.map((data, index) => {
          if (typeof data === "string") return <Box key={index}>{data}</Box>;
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: palette.primary.main,
                }}
              >
                {highlightCapitalWords(data.step)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                }}
              >
                {highlightCapitalWords(data.result)}
              </Typography>
            </Box>
          );
        });
      case "Game Time":
        if (typeof content.contentData === "string")
          return <Typography>{content.contentData}</Typography>;

        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {content.contentData.map((data, index) => (
              <Typography
                key={index}
                sx={{
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {highlightCapitalWords(data as string)}
              </Typography>
            ))}
          </Box>
        );

      case "Prizes and Contributions":
        if (typeof content.contentData === "string")
          return <Typography>{content.contentData}</Typography>;
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {content.contentData.map((data, index) => (
              <Typography
                key={index}
                sx={{
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {highlightCapitalWords(data as string)}
              </Typography>
            ))}
          </Box>
        );
      default:
        return "No Content Found";
    }
  };

  return (
    <Modal isOpen={footerModalOpen}>
      <ModalContent
        sx={{
          width: mobileScreen ? "80vw" : "30vw",
          padding: "20px",
          minWidth: "250px",
          minHeight: "600px",
          maxHeight: "600px",
        }}
      >
        <TabContext value={value}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "24px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TabList onChange={handleChange} variant="scrollable">
              {ModalContentData.map((data, index) => {
                return (
                  <Tab
                    key={index}
                    label={data.contentName}
                    value={String(index + 1)}
                  />
                );
              })}
            </TabList>
            <IconButton onClick={() => setFooterModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {ModalContentData.map((data, index) => {
            return (
              <TabPanel
                key={index}
                value={String(index + 1)}
                sx={{
                  overflowY: "auto",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {RenderTabPanelContent(data.contentName)}
                </Box>
              </TabPanel>
            );
          })}
        </TabContext>
      </ModalContent>
    </Modal>
  );
};

const highlightCapitalWords = (text: string) => {
  if (text.includes("The") || text.includes("UTC")) return text;
  const words = text.split(" ");
  return words.map((word, index) => {
    const startsWithCapital = /^[A-Z]/.test(word);
    return (
      <span
        key={index}
        style={{ color: startsWithCapital ? "#87cefa" : "inherit" }}
      >
        {word + (index < words.length - 1 ? " " : "")}
      </span>
    );
  });
};
