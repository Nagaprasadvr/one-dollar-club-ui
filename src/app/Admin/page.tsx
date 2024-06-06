"use client";

import { AppContext } from "@/components/Context/AppContext";
import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { adminGate } from "./adminGate";
import { Message } from "@/components/HelperComponents/Message";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

const Admin = () => {
  const { sdk, poolConfig, setPoolConfig } = useContext(AppContext);
  const { connected, publicKey } = useWallet();
  if (!publicKey || !connected || !sdk || !poolConfig) return null;

  if (!adminGate(publicKey)) return <Message message="You are not an admin" />;

  const handleActivatePool = async () => {
    toast.loading("Activating pool", {
      id: "activate-pool",
    });
    try {
      const updatedPoolConfig = await poolConfig.activatePool();

      toast.success("Pool activated", {
        id: "activate-pool",
      });
      setPoolConfig(updatedPoolConfig);
    } catch (e) {
      console.error(e);
      toast.error("Failed to activate pool", {
        id: "activate-pool",
      });
    }
  };

  const handleInactivatePool = async () => {
    toast.loading("Inactivating pool", {
      id: "inactivate-pool",
    });
    try {
      const updatedPoolConfig = await poolConfig.pausePool();
      toast.success("Pool inactivated", {
        id: "inactivate-pool",
      });
      setPoolConfig(updatedPoolConfig);
    } catch (e) {
      console.error(e);
      toast.error("Failed to inactivate pool", {
        id: "inactivate-pool",
      });
    }
  };

  const handlePauseDeposit = async () => {
    toast.loading("Pausing deposits", {
      id: "pause-deposit",
    });
    try {
      const updatedPoolConfig = await poolConfig.pauseDeposits();
      toast.success("Deposits paused", {
        id: "pause-deposit",
      });
      setPoolConfig(updatedPoolConfig);
    } catch (e) {
      console.error(e);
      toast.error("Failed to pause deposits", {
        id: "pause-deposit",
      });
    }
  };

  const handleResumeDeposit = async () => {
    toast.loading("Resuming deposits", {
      id: "resume-deposit",
    });
    try {
      const updatedPoolConfig = await poolConfig.activateDeposits();
      toast.success("Deposits resumed", {
        id: "resume-deposit",
      });
      setPoolConfig(updatedPoolConfig);
    } catch (e) {
      console.error(e);
      toast.error("Failed to resume deposits", {
        id: "resume-deposit",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3">Admin Actions</Typography>
      <Typography fontWeight={"bold"}>
        Pool State:{poolConfig.poolState}
      </Typography>
      {poolConfig.poolState === "Active" ? (
        <Button onClick={handleInactivatePool}>Inactivate Pool</Button>
      ) : (
        <Button onClick={handleActivatePool}>Activate Pool</Button>
      )}
      <Typography fontWeight={"bold"}>
        Pool Deposits Paused:{poolConfig.poolDepositsPaused ? "Yes" : "No"}
      </Typography>
      {poolConfig.poolDepositsPaused ? (
        <Button onClick={handleResumeDeposit}>Resume Deposits</Button>
      ) : (
        <Button onClick={handlePauseDeposit}>Pause Deposits</Button>
      )}
    </Box>
  );
};

export default Admin;
