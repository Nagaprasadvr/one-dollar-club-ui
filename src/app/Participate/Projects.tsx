import { AppContext } from "@/components/Context/AppContext";
import { Message } from "@/components/HelperComponents/Message";
import { API_BASE_URL, PROJECTS_TO_PLAY } from "@/utils/constants";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CreatePositionModal } from "./CreatePositionModal";

import { RenderProject } from "./RenderProject";
import {
  BirdeyeTokenPriceData,
  PositionData,
  PositionInputData,
} from "@/utils/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { safeDivide } from "@/utils/helpers";
import { Refresh } from "@mui/icons-material";
import { AccessGameModal } from "./AccessGameModaL";

const defaultTokenPriceData: BirdeyeTokenPriceData = {
  address: "",
  value: 0,
  updateUnixTime: 0,
  updateHumanTime: "",
  // priceChange24h: 0,
};

export const Projects = () => {
  const {
    poolConfig,
    sdk,
    setIsAllowedToPlay,
    pointsRemaining,
    isAllowedToPlay,
    setPointsRemaining,
    tokensPrices,
    setTriggerRefetchUserData,
    triggerRefetchUserData,
    positions,
    resultingPoints,
    updatePoolConfig,
  } = useContext(AppContext);

  const wallet = useWallet();
  const [createPositionModelOpen, setCreatePositionModelOpen] = useState(false);
  const [accessGameModalOpen, setAccessGameModalOpen] = useState(false);
  const [positionsInputData, setPositionsInputData] = useState<
    PositionInputData[]
  >([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("");

  const [selectedTokenData, setSelectedTokenData] =
    useState<BirdeyeTokenPriceData>(defaultTokenPriceData);
  useEffect(() => {
    if (tokensPrices?.length > 0) {
      const activeTokenData = tokensPrices.find(
        (token) => token.address === selectedTokenAddress
      );
      if (activeTokenData) setSelectedTokenData(activeTokenData);
    }
  }, [tokensPrices]);

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

  const RenderHeader = useMemo(() => {
    if (!poolConfig) return null;
    if (poolConfig.poolState === "Inactive" || poolConfig.poolDepositsPaused) {
      if (resultingPoints) {
        return (
          <Typography variant="h6" fontWeight={"bold"}>
            Resulting Points:{" "}
            <span
              style={{
                color: "#87cefa",
              }}
            >
              {resultingPoints.toLocaleString("en-US", {
                maximumFractionDigits: 4,
              })}
            </span>
          </Typography>
        );
      } else return null;
    }

    if (!isAllowedToPlay && !poolConfig.poolDepositsPaused) {
      return <Button onClick={() => setAccessGameModalOpen(true)}>Play</Button>;
    }

    if (isAllowedToPlay && pointsRemaining && positions?.length === 0) {
      return (
        <Typography variant="h6" fontWeight={"bold"}>
          Create Positions
        </Typography>
      );
    }

    if (resultingPoints !== null) {
      return (
        <Typography variant="h6" fontWeight={"bold"}>
          Resulting Points:{" "}
          <span
            style={{
              color: "#87cefa",
            }}
          >
            {resultingPoints.toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })}
          </span>
        </Typography>
      );
    }

    return null;
  }, [poolConfig, resultingPoints, isAllowedToPlay, pointsRemaining]);

  const canDisplayConfirmButton = useMemo(() => {
    if (!poolConfig) return false;
    return (
      isAllowedToPlay &&
      pointsRemaining !== 0 &&
      poolConfig.poolState === "Active" &&
      positions.length !== PROJECTS_TO_PLAY.length &&
      positionsInputData.length > 0
    );
  }, [
    isAllowedToPlay,
    pointsRemaining,
    poolConfig,
    positions.length,
    positionsInputData.length,
  ]);

  const appendPositionInputData = (positionInputData: PositionInputData) => {
    setPositionsInputData((prev) => [...prev, positionInputData]);
  };

  const updatePositionInputData = (positionInputData: PositionInputData) => {
    setPositionsInputData((prev) =>
      prev.map((position) =>
        position.tokenName === positionInputData.tokenName
          ? positionInputData
          : position
      )
    );
  };

  const deletePositionInputData = (tokenName: string) => {
    setPositionsInputData((prev) =>
      prev.filter((position) => position.tokenName !== tokenName)
    );
  };

  const handleConfirmAllpositions = async () => {
    if (!wallet.publicKey || !pointsRemaining) {
      toast.error(
        "Please connect wallet or you dont have enough points remaining to play",
        {
          id: "createPosition",
        }
      );
      return;
    }
    if (positionsInputData.length === 0) {
      toast.error("Please create atlest a single position", {
        id: "createPosition",
      });
      return;
    }
    const pointsSum = positionsInputData.reduce(
      (acc, position) => acc + Number(position.pointsAllocated),
      0
    );
    if (pointsSum > pointsRemaining) {
      toast.error("You have allocated more points than you have", {
        id: "createPosition",
      });
      return;
    }
    toast.loading(`Saving ${positionsInputData.length} Positions...`, {
      id: "createPosition",
    });
    try {
      const positionsToSave: PositionData[] = [];

      for (const position of positionsInputData) {
        const positionData: PositionData = {
          pubkey: wallet.publicKey.toBase58(),
          tokenName: position.tokenName,
          positionType: position.positionType,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          pointsAllocated: Number(position.pointsAllocated),
          tokenMint: position.tokenMint,
          liquidationPrice:
            position.positionType === "long"
              ? position.entryPrice -
                safeDivide(position.entryPrice, Number(position.leverage))
              : position.entryPrice +
                safeDivide(position.entryPrice, Number(position.leverage)),
        };
        positionsToSave.push(positionData);
      }

      const tokenNames = {
        tokens: positionsInputData.map((position) => position.tokenName),
      };
      if (wallet.signMessage) {
        await wallet.signMessage(
          new Uint8Array(
            JSON.stringify(tokenNames)
              .split("")
              .map((c) => c.charCodeAt(0))
          )
        );
        toast.success("signature success", {
          id: "createPosition",
        });
        toast.loading("Recording Positions...", {
          id: "createPosition",
        });
        const createPositionsResponse = await fetch(
          `${API_BASE_URL}/poolCreatePositions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              positions: positionsToSave,
              pubkey: wallet.publicKey.toBase58(),
            }),
          }
        );
        const createPositionsResponseJson =
          await createPositionsResponse.json();
        if (createPositionsResponse.status === 200) {
          toast.success("Position saved successfully", {
            id: "createPosition",
          });
          setTriggerRefetchUserData(!triggerRefetchUserData);
        } else {
          toast.error(
            `Error while saving positions:${createPositionsResponseJson.error}`,
            {
              id: "createPosition",
            }
          );
        }
      }
    } catch (err) {
      toast.error("Error while saving positions", {
        id: "createPosition",
      });
    }
  };

  if (!sdk || !poolConfig) {
    return <Message message="Loading..." />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        width: "90%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {RenderHeader}
        <Tooltip title="Refresh">
          <IconButton
            onClick={() => {
              setTriggerRefetchUserData(!triggerRefetchUserData);
              updatePoolConfig();
              toast.loading("Refreshing...", {
                duration: 2000,
              });
            }}
          >
            <Refresh
              sx={{
                fontSize: "22px",
                color: "#87cefa",
              }}
            />
          </IconButton>
        </Tooltip>
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
          mt: "20px",
          mb: "20px",
        }}
      >
        {PROJECTS_TO_PLAY.map((project) => (
          <RenderProject
            key={project.mint}
            positionsInputData={positionsInputData}
            project={project}
            setModalOpen={setCreatePositionModelOpen}
            setSelectedToken={setSelectedToken}
            setSelectedTokenAddress={setSelectedTokenAddress}
            setSelectedTokenData={setSelectedTokenData}
          />
        ))}
      </Box>
      {canDisplayConfirmButton && (
        <Box
          sx={{
            display: "flex",
            mb: "50px",
          }}
          onClick={handleConfirmAllpositions}
        >
          <Button>Confirm all positions</Button>
        </Box>
      )}

      {createPositionModelOpen && (
        <CreatePositionModal
          open={createPositionModelOpen}
          setOpen={setCreatePositionModelOpen}
          tokenAddress={selectedTokenAddress}
          tokenSymbol={selectedToken}
          activeTokenData={selectedTokenData}
          appendPositionInputData={appendPositionInputData}
          positionsInputData={positionsInputData}
          updatePositionInputData={updatePositionInputData}
          deletePositionInputData={deletePositionInputData}
        />
      )}

      {accessGameModalOpen && (
        <AccessGameModal
          open={accessGameModalOpen}
          setOpen={setAccessGameModalOpen}
        />
      )}
    </Box>
  );
};
