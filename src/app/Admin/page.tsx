"use client";

import { AppContext } from "@/components/Context/AppContext";
import { Box, Button, Input, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { adminGate } from "./adminGate";
import { Message } from "@/components/HelperComponents/Message";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
import * as sha256 from "js-sha256";

const Admin = () => {
  const { sdk, poolConfig } = useContext(AppContext);
  const { connected, publicKey } = useWallet();

  const [authSecret, setAuthSecret] = useState("");
  const [newDepositPerUser, setNewDepositPerUser] = useState<string | number>(
    ""
  );

  useEffect(() => {
    if (!poolConfig) return;
    setNewDepositPerUser(poolConfig.poolDepositPerUser);
  }, [poolConfig]);

  const handleAuthSecretChange = (e: any) => {
    setAuthSecret(e.target.value);
  };

  const handleActivatePool = async () => {
    if (!poolConfig) return;
    toast.loading("Activating pool", {
      id: "activate-pool",
    });

    try {
      const updatedPoolConfig = await poolConfig.activatePool();

      toast.success("Pool activated", {
        id: "activate-pool",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to activate pool", {
        id: "activate-pool",
      });
    }
  };

  const handleChangePoolDepositPerUser = async () => {
    if (!poolConfig) return;
    if (Number(poolConfig.poolDepositPerUser) === Number(newDepositPerUser)) {
      toast.error("New deposit per user is the same as the current", {
        id: "change-deposit-per-user",
      });
      return;
    }
    toast.loading("changing pool deposit per user", {
      id: "change-deposit-per-user",
    });

    try {
      await poolConfig.changeDepositPerUser(Number(newDepositPerUser));
      toast.success("Pool deposit per user changed", {
        id: "change-deposit-per-user",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to change pool deposit per user", {
        id: "change-deposit-per-user",
      });
    }
  };

  const handleInactivatePool = async () => {
    if (!poolConfig) return;
    toast.loading("Inactivating pool", {
      id: "inactivate-pool",
    });
    try {
      await poolConfig.pausePool();
      toast.success("Pool inactivated", {
        id: "inactivate-pool",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to inactivate pool", {
        id: "inactivate-pool",
      });
    }
  };

  const handlePauseDeposit = async () => {
    if (!poolConfig) return;
    toast.loading("Pausing deposits", {
      id: "pause-deposit",
    });
    try {
      await poolConfig.pauseDeposits();
      toast.success("Deposits paused", {
        id: "pause-deposit",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to pause deposits", {
        id: "pause-deposit",
      });
    }
  };

  const handleResumeDeposit = async () => {
    if (!poolConfig) return;
    toast.loading("Resuming deposits", {
      id: "resume-deposit",
    });
    try {
      await poolConfig.activateDeposits();
      toast.success("Deposits resumed", {
        id: "resume-deposit",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to resume deposits", {
        id: "resume-deposit",
      });
    }
  };

  const handleClickChangePoolId = async () => {
    if (!poolConfig) return;
    toast.loading("Changing pool id", {
      id: "change-pool-id",
    });
    const authHash = sha256.sha256(authSecret);
    try {
      await axios.post(API_BASE_URL + "/changePoolIdByAuthority", {
        authHash,
      });
      toast.success("Pool id changed", {
        id: "change-pool-id",
      });
      setAuthSecret("");
    } catch (e) {
      console.error(e);
      toast.error("Failed to change pool id", {
        id: "change-pool-id",
      });
    }
  };

  if (!publicKey || !connected || !sdk || !poolConfig) return null;
  if (!adminGate(publicKey)) return <Message message="You are not an admin" />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        width: "100%",
        alignItems: "center",
        height: "80vh",
        overflowY: "auto",
        marginBottom: "20px",
      }}
    >
      <Typography variant="h3">Admin Actions</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          alignItems: "center",
        }}
      >
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
        <Typography fontWeight={"bold"}>Change Pool Id</Typography>
        <Input
          placeholder="Auth Secret"
          value={authSecret}
          onChange={handleAuthSecretChange}
          type="password"
        />
        <Button onClick={handleClickChangePoolId}>Change Pool Id</Button>
        <Typography fontWeight={"bold"}>
          Change Pool Deposit Per User
        </Typography>
        <Input
          placeholder="New Deposit Per User"
          value={newDepositPerUser}
          onChange={(e) => setNewDepositPerUser(parseInt(e.target.value))}
          type="number"
        />
        <Button onClick={handleChangePoolDepositPerUser}>
          Change Deposit Per User
        </Button>
      </Box>
    </Box>
  );
};

export default Admin;
