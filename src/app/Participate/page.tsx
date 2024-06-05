"use client";
import { AppContext } from "@/components/Context/AppContext";
import { ActiveRound } from "./ActiveRound";
import { Message } from "@/components/HelperComponents/Message";
import { Box } from "@mui/material";
import { useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Projects } from "./Projects";

const Participate = () => {
  const { poolConfig, isFetchingPoolConfig, sdk } = useContext(AppContext);

  const { connected } = useWallet();

  if (!connected) {
    return <Message message="Connect wallet" />;
  }

  if (isFetchingPoolConfig) {
    return <Message message="Loading..." />;
  }

  if (!poolConfig) {
    return <Message message="Game is down" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
        width: "100%",
        height: "80vh",
        overflowY: "auto",
        overflowX: "hidden",
        justifyContent: "flex-start",
      }}
    >
      <ActiveRound poolConfig={poolConfig} />
      <Projects />
    </Box>
  );
};

export default Participate;
