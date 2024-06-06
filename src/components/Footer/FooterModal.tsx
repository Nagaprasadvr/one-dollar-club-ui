import { ModalContent } from "@/components/HelperComponents/ModalContent";
import { Modal } from "@/components/HelperComponents/Modal";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import React, { useContext, useEffect } from "react";
import { IconButton, Typography } from "@mui/material";
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
        step: "Connect your wallet and Deposit 50,000 $BONK to get started",
        result: "Upon successful deposit, receive 100 points.",
      },
      {
        step: "Pick a set of coins and allocate points",
        result: "Set the position of your trade to maximize winning chances.",
      },
      {
        step: "Confirm the positions by signing from the connected wallet",
        result:
          "Remember, positions cannot be updated or modified once signed.",
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
      "The player with the highest points at 23:00 UTC wins 50% of the pool prize.",
      "Remaining 50% of the pool is allocated as follows:",
      "25% to support community projects like WildlifeSOS, bonk dao treasury,Telega Charity , fund public goods, buy and burn bonk for 30 days.",
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
              fontSize: "50px",
              width: "100%",
              height: "100%",
              textAlign: "center",
            }}
          >
            {content.contentData as string}
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
                {data.step}
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                }}
              >
                {data.result}
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
                {data as string}
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
                {data as string}
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
          width: "30vw",
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
