"use client";
import {
  Box,
  Button,
  ClickAwayListener,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { minimizePubkey } from "@/utils/helpers";
import { AppContext } from "../Context/AppContext";

export const Wallet = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>> | null;
}) => {
  const { resetUserData } = useContext(AppContext);
  const { setVisible } = useWalletModal();
  const handleConnect = () => {
    if (setOpen) {
      setOpen(false);
    }
    setVisible(true);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { connected, publicKey, disconnect, wallet } = useWallet();

  const handleDisconnect = () => {
    disconnect().then(() => {
      toast.success("Disconnected from wallet !");
    });
    setAnchorEl(null);
  };

  return (
    <>
      {!connected ? (
        <Button
          sx={{
            background: "transparent",
            color: "white",
            border: "2px solid white",
            borderRadius: "0.5rem",
            fontWeight: "500",
          }}
          onClick={handleConnect}
        >
          Connect Wallet
        </Button>
      ) : (
        wallet && (
          <>
            <ClickAwayListener onClickAway={handleClose}>
              <Box
                display={"flex"}
                flexDirection={"row"}
                sx={{
                  borderRadius: "0.5rem",
                  border: "2px solid white",
                  zIndex: 100,
                  padding: "6px",
                  height: "30px",
                }}
                alignContent={"center"}
                alignItems={"center"}
                justifyContent={"center"}
                gap="8px"
              >
                <Image
                  alt={wallet.adapter.name}
                  height={24}
                  src={wallet.adapter.icon}
                  width={24}
                />

                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "black",
                    height: "30px",
                  }}
                  onClick={handleClick}
                >
                  {publicKey && connected && (
                    <Typography fontSize={"20px"}>
                      {minimizePubkey(publicKey.toBase58())}
                    </Typography>
                  )}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  sx={{
                    height: "300px",
                    width: "300px",
                  }}
                >
                  <MenuItem
                    onClick={handleDisconnect}
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "white",
                      },
                    }}
                  >
                    Disconnect
                  </MenuItem>
                </Menu>
              </Box>
            </ClickAwayListener>
          </>
        )
      )}
    </>
  );
};
