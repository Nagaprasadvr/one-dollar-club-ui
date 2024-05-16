import { AppContext } from "@/components/Context/AppContext";
import ApexChartComponent from "@/components/HelperComponents/ApexChartComponent";
import { Card } from "@/components/HelperComponents/Card";
import { Message } from "@/components/HelperComponents/Message";
import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import { birdeyeUrl, PROJECTS_TO_PLAY } from "@/utils/constants";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CreatePositionModal } from "./CreatePositionModal";
import { minimizePubkey } from "@/utils/helpers";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { CallMade } from "@mui/icons-material";
import { RenderPositionStats } from "./RenderPositionStats";

export const Projects = () => {
  const {
    poolConfig,
    sdk,
    setIsAllowedToPlay,
    pointsRemaining,
    isAllowedToPlay,
    positions,
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
      } catch (err) {
        toast.error("Error while depositing to play", {
          id: "depositing",
        });
      }
    }
  };

  const getActivePosition = (tokenName: string) => {
    return positions.find((position) => position.tokenName === tokenName);
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
          <Card
            key={project.mint}
            sx={{
              width: "90%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 10px",
                gap: "40px",
                width: "100%",
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
              <TextWithValue
                text="Project"
                value={project.name}
                gap="5px"
                endComponent={
                  <Tooltip title="Click to view project on Birdeye">
                    <IconButton
                      onClick={() => {
                        window.open(
                          `${birdeyeUrl}${project.mint}?chain=solana`,
                          "_blank"
                        );
                      }}
                    >
                      <CallMade
                        sx={{
                          fontSize: "20px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                }
              />

              <TextWithValue
                text="Mint"
                value={minimizePubkey(project.mint)}
                gap="5px"
                startComponent={
                  <Tooltip title="Copy Token Address">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(project.mint);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <ContentCopy
                        sx={{
                          fontSize: "20px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                }
              />

              <TextWithValue
                text="Price"
                value={`$${Math.floor(
                  Math.random() * 100
                )}`.toLocaleLowerCase()}
                gap="5px"
              />
              <TextWithValue
                text="24 hour change"
                value={Math.floor(Math.random() * 100).toLocaleString()}
                gap="5px"
              />
              <ApexChartComponent />
              {!getActivePosition(project.name) && isAllowedToPlay && (
                <Button
                  disabled={pointsRemaining === 0}
                  onClick={() => {
                    setModelOpen(true);
                    setSelectedToken(project.name);
                    setSelectedTokenAddress(project.mint);
                  }}
                >
                  Create Position
                </Button>
              )}
            </Box>

            <RenderPositionStats projectName={project.name} />
          </Card>
        ))}
      </Box>
      <CreatePositionModal
        open={modelOpen}
        setOpen={setModelOpen}
        tokenAddress={selectedTokenAddress}
        tokenSymbol={selectedToken}
      />
    </Box>
  );
};
