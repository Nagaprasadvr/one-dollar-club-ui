"use client";
import { AppContext } from "@/components/Context/AppContext";
import { Message } from "@/components/HelperComponents/Message";
import { Box, Button, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";
import * as spl from "@solana/spl-token";
import * as solana from "@solana/web3.js";
import toast from "react-hot-toast";
import { getTokenSymbolFromMint } from "@/utils/helpers";

const Faucet = () => {
  const { connected, publicKey } = useWallet();
  const wallet = useWallet();
  const { poolConfig, sdk } = useContext(AppContext);

  const [tokenBalance, setTokenBalance] = useState<number>(0);

  useEffect(() => {
    setTokenBalance(0);
  }, [publicKey]);

  const fetchTokenBalance = async () => {
    if (!sdk || !publicKey || !connected || !poolConfig) return;
    try {
      const ataAddress = await spl.getAssociatedTokenAddress(
        poolConfig.poolActiveMint,
        publicKey
      );

      const ataAccount = await spl.getAccount(sdk.connection, ataAddress);
      if (!ataAccount) return;
      const balance = Number(ataAccount.amount) / Math.pow(10, 9);
      setTokenBalance(balance);
    } catch (e) {
      console.error(e);
    }
  };

  const updateTokenBalance = async () => {
    setTimeout(async () => {
      toast.loading("Updating balance", {
        id: "update-balance",
      });
      await fetchTokenBalance();
      toast.success("Balance updated", {
        id: "update-balance",
      });
    }, 2000);
  };

  useEffect(() => {
    fetchTokenBalance();
  }, [sdk, publicKey, connected, poolConfig]);

  const tokenMintAuth = [
    156, 10, 41, 96, 154, 13, 165, 207, 21, 108, 226, 119, 241, 34, 232, 21, 56,
    250, 109, 88, 196, 249, 4, 123, 219, 68, 52, 147, 113, 43, 154, 145, 57, 37,
    218, 171, 3, 82, 102, 15, 147, 148, 73, 88, 217, 77, 30, 64, 80, 172, 220,
    236, 171, 144, 48, 39, 189, 228, 155, 170, 72, 39, 121, 170,
  ];

  if (!publicKey || !connected)
    return <Message message="Connect your wallet to access the faucet" />;

  if (!poolConfig) return <Message message="Pool config not found" />;

  const handleMint = async () => {
    if (!sdk || !wallet || !publicKey || !poolConfig) return;
    const tokenMintKeypair = solana.Keypair.fromSecretKey(
      new Uint8Array(tokenMintAuth)
    );
    const ataAddress = spl.getAssociatedTokenAddressSync(
      poolConfig.poolActiveMint,
      publicKey
    );
    toast.loading("Processing", {
      id: "mint-tokens",
    });
    let ataAccount = null;
    try {
      ataAccount = await spl.getAccount(sdk.connection, ataAddress);
    } catch (e) {}
    const ixs: solana.TransactionInstruction[] = [];
    if (!ataAccount) {
      toast.loading("Creating associated token account", {
        id: "mint-tokens",
      });
      const createIx = spl.createAssociatedTokenAccountInstruction(
        publicKey,
        ataAddress,
        publicKey,
        poolConfig.poolActiveMint
      );

      ixs.push(createIx);
    }

    try {
      toast.loading("Minting tokens to your Account", {
        id: "mint-tokens",
      });
      const ix = spl.createMintToInstruction(
        poolConfig.poolActiveMint,
        ataAddress,
        tokenMintKeypair.publicKey,
        poolConfig.poolDepositPerUser * 2 * Math.pow(10, 9)
      );
      ixs.push(ix);
      const tx = new solana.Transaction();
      const latestBlockhash = await sdk.connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
      tx.feePayer = publicKey;
      ixs.forEach((ix) => tx.add(ix));
      const message = tx.compileMessage();
      const versionedTx = new solana.VersionedTransaction(message);
      if (!wallet.signTransaction) return;
      versionedTx.sign([tokenMintKeypair]);
      const signedTx = await wallet.signTransaction(versionedTx);
      await sdk.connection.sendTransaction(signedTx);
      toast.success("Tokens minted successfully", {
        id: "mint-tokens",
      });
      updateTokenBalance();
    } catch (e) {
      toast.error("Failed to mint tokens", {
        id: "mint-tokens",
      });
      console.error(e);
    }
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
      <Typography
        sx={{
          fontWeight: "bold",
        }}
        variant="h3"
      >
        Faucet
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          Token Balance:
        </Typography>
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          {tokenBalance.toLocaleString() +
            " " +
            getTokenSymbolFromMint(poolConfig)}
        </Typography>
      </Box>
      <Button onClick={handleMint}>Mint</Button>
    </Box>
  );
};

export default Faucet;
