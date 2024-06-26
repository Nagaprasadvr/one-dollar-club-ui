import { ModalContent } from "@/components/HelperComponents/ModalContent";
import { Modal } from "@/components/HelperComponents/Modal";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AppContext } from "@/components/Context/AppContext";
import { API_BASE_URL, NFTGatedTokens } from "@/utils/constants";
import { Dispatch, SetStateAction, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

export const AccessGameModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const mobileScreen = useMediaQuery("(max-width:800px)");

  const { connected, publicKey } = useWallet();
  const {
    poolConfig,
    sdk,
    setIsAllowedToPlay,
    setPointsRemaining,
    setTriggerRefetchUserData,
    triggerRefetchUserData,
  } = useContext(AppContext);

  const [selectedNFT, setSelectedNFT] = useState<string>(
    NFTGatedTokens[0].name
  );

  const isDevnet = useMemo(() => {
    return sdk && sdk.connection.rpcEndpoint.includes("devnet");
  }, [sdk]);

  const handlePoolDeposit = async () => {
    if (!poolConfig) return;
    if (sdk) {
      toast.loading("Depositing to play...", {
        id: "depositing",
      });
      try {
        await poolConfig.deposit();
        toast.success("Deposit successful", {
          id: "depositing",
        });
        setIsAllowedToPlay(true);
        const responsePoints = await fetch(
          `${API_BASE_URL}/poolPoints?pubkey=${sdk.wallet.publicKey.toBase58()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responsePointsJson = await responsePoints.json();
        setPointsRemaining(responsePointsJson.data);
      } catch (err) {
        let errString = "Error while depositing to play" + " ";
        errString += err + " ";

        if (isDevnet) {
          errString += "Go to Faucet and get some devnet tokens to play";
        }
        toast.error(errString, {
          id: "depositing",
        });
      }
    }
  };

  const handleVerifyNFT = async (nftCollectionAddress: string) => {
    try {
      if (!sdk || !connected || !publicKey) return;
      toast.loading("Verifying NFT...", {
        id: "verifyingNFT",
      });
      const response = await fetch(`${API_BASE_URL}/verifyNFT`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nftCollectionAddress,
          owner: publicKey.toBase58(),
        }),
      });

      const responseJson = await response.json();
      if (responseJson?.message === "NFT verified") {
        toast.success("NFT verified successfully", {
          id: "verifyingNFT",
        });
        setTriggerRefetchUserData(!triggerRefetchUserData);
        setOpen(false);
      } else {
        toast.error(
          "NFT verification failed, Possibly you dont have the selected NFT",
          {
            id: "verifyingNFT",
          }
        );
      }
    } catch (err) {
      console.log(err);
      toast.error("Error while verifying NFT", {
        id: "verifyingNFT",
      });
    }
  };

  return (
    <Modal isOpen={open}>
      <ModalContent
        sx={{
          width: mobileScreen ? "80vw" : "30vw",
          padding: "20px",
          minWidth: "250px",
          overflowY: "auto",
          height: "fit-content",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography fontSize={"18px"} fontWeight={"bold"}>
            LFG, lets Play
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Depoist 40k BONK to Play
            </Typography>
            <Button onClick={handlePoolDeposit}>Deposit</Button>
          </Box>
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            OR
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Verify NFT Ownership for few selected ones
            </Typography>
            <FormControl>
              <Select
                value={selectedNFT}
                onChange={(e) => setSelectedNFT(e.target.value as string)}
                defaultValue={NFTGatedTokens[0].name}
                sx={{
                  fontWeight: "bold",
                }}
              >
                {NFTGatedTokens.map((nft) => (
                  <MenuItem key={nft.symbol} value={nft.name}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                      }}
                    >
                      <Image
                        src={nft.imageUrl}
                        alt={nft.name}
                        height={30}
                        width={30}
                      />
                      <Typography>
                        {nft.name} ({nft.symbol})
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={() => {
                const selectedNFTObj = NFTGatedTokens.find(
                  (nft) => nft.name === selectedNFT
                );
                if (selectedNFTObj)
                  handleVerifyNFT(selectedNFTObj.collectionAddress);
              }}
            >
              Verify
            </Button>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};
