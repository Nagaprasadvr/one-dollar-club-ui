import { AppContext } from "@/components/Context/AppContext";
import { Message } from "@/components/HelperComponents/Message";
import { API_BASE_URL, PROJECTS_TO_PLAY } from "@/utils/constants";
import { Box, Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CreatePositionModal } from "./CreatePositionModal";

import { RenderProject } from "./RenderProject";

export const Projects = () => {
  const {
    poolConfig,
    sdk,
    setIsAllowedToPlay,
    pointsRemaining,
    isAllowedToPlay,
    setPointsRemaining,
  } = useContext(AppContext);

  const [modelOpen, setModelOpen] = useState(false);

  const [selectedToken, setSelectedToken] = useState<string>("");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("");

  if (!sdk || !poolConfig) {
    return <Message message="Loading..." />;
  }

  const handlePoolDeposit = async () => {
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
        toast.error("Error while depositing to play", {
          id: "depositing",
        });
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        width: "80%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        {pointsRemaining == 0 && (
          <Typography variant="h5" fontWeight={"bold"}>
            You have 0 points remaining, please wait for the next round
          </Typography>
        )}
        {Number(pointsRemaining) > 0 && isAllowedToPlay && (
          <Typography variant="h5" fontWeight={"bold"}>
            Create Positions
          </Typography>
        )}
        {!isAllowedToPlay && (
          <Button onClick={handlePoolDeposit}>Deposit 1 USDC to Play</Button>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          padding: "10px",
          overflowY: "auto",
          overflowX: "hidden",
          width: "100%",
          mb: "50px",
          mt: "20px",
        }}
      >
        {PROJECTS_TO_PLAY.map((project) => (
          <RenderProject
            key={project.mint}
            project={project}
            setModalOpen={setModelOpen}
            setSelectedToken={setSelectedToken}
            setSelectedTokenAddress={setSelectedTokenAddress}
          />
        ))}
      </Box>
      {modelOpen && (
        <CreatePositionModal
          open={modelOpen}
          setOpen={setModelOpen}
          tokenAddress={selectedTokenAddress}
          tokenSymbol={selectedToken}
        />
      )}
    </Box>
  );
};
