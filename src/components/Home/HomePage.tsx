"use client";
import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  SxProps,
  Button,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
const mobileStyles: SxProps = {
  display: "flex",
  flexDirection: "column",
  gap: "40px",
  alignItems: "flex-start",
  marginTop: "20px",
  textWrap: "wrap",
  padding: "10px",
};

export const HomePage = () => {
  const { breakpoints } = useTheme();
  const mobileScreen = useMediaQuery(breakpoints.down("sm"));
  const router = useRouter();
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const handleLaunchGame = () => {
    if (!connected) {
      setVisible(true);
    }
    router.push("/Participate");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
        height: "80vh",
        overflow: "auto",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <Box
        sx={
          mobileScreen
            ? {
                ...mobileStyles,
              }
            : {
                display: "flex",
                flexDirection: "column",
                gap: "40px",
                alignItems: "center",
                marginTop: "50px",
                width: "100%",
                justifyContent: "center",
                padding: "20px",
              }
        }
      >
        <Typography
          sx={{
            fontWeight: "bold",
            textAlign: mobileScreen ? "start" : "center",
            width: "100%",
            fontSize: "50px",
          }}
        >
          One Dollar Club,LFG!
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            textWrap: "wrap",
            fontSize: "30px",
            width: "100%",
            textAlign: mobileScreen ? "start" : "center",
          }}
        >
          No Pump, No Rug, Just Fun{" "}
        </Typography>

        {/* <Typography
          variant={mobileScreen ? "h4" : "h2"}
          gutterBottom
          color={"primary"}
        >
          Welcome to Øxpublish
        </Typography>
        <Typography variant="body1" gutterBottom>
          Empowering Research Publishing on Solana and Arweave
        </Typography>

        <Box>
          <Typography variant={mobileScreen ? "h5" : "h4"} gutterBottom>
            Why Choose Øxpublish?
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Solana-Powered Scalability"
                secondary="Harnessing the speed and scalability of Solana blockchain for lightning-fast transactions."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Arweave's Permanent Storage"
                secondary="Leveraging Arweave's decentralized storage for tamper-proof archival of research papers."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Tokenized Incentives"
                secondary="Earn tokens for contributing quality research, fostering a fair and incentivized ecosystem."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Decentralized Governance"
                secondary="Participate in community-driven decision-making for transparent platform development."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Global Accessibility"
                secondary="Low transaction fees and decentralized hosting for universal access to research papers."
              />
            </ListItem>
          </List>
        </Box>

        <Typography
          variant="body1"
          gutterBottom
          sx={
            mobileScreen
              ? { width: "100%" }
              : { width: "50%", textAlign: "center" }
          }
        >
          Join us in revolutionizing research publishing. Explore cutting-edge
          research, share your insights, and be part of a decentralized future
          with Øxpublish on Solana and Arweave.
        </Typography> */}
        <Button onClick={handleLaunchGame}>Launch Game</Button>
      </Box>
    </Box>
  );
};
