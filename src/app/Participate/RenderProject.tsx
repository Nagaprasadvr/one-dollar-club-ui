import ApexChartComponent from "@/components/HelperComponents/ApexChartComponent";
import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import { birdeyeUrl } from "@/utils/constants";
import { get24Change, minimizePubkey } from "@/utils/helpers";
import {
  ArrowDownward,
  ArrowUpward,
  CallMade,
  ContentCopy,
} from "@mui/icons-material";
import { Box, Tooltip, IconButton, Button } from "@mui/material";
import { Card } from "@/components/HelperComponents/Card";
import toast from "react-hot-toast";
import { RenderPositionStats } from "./RenderPositionStats";
import { useContext, useMemo } from "react";
import { AppContext } from "@/components/Context/AppContext";
import {
  BirdeyeTokenPriceData,
  PositionInputData,
  Project,
} from "@/utils/types";
import Image from "next/image";

export const RenderProject = ({
  project,
  setModalOpen,
  setSelectedToken,
  setSelectedTokenAddress,
  setSelectedTokenData,
  positionsInputData,
}: {
  project: Project;
  setModalOpen: (value: boolean) => void;
  setSelectedToken: (value: string) => void;
  setSelectedTokenAddress: (value: string) => void;
  setSelectedTokenData: (value: BirdeyeTokenPriceData) => void;
  positionsInputData: PositionInputData[];
}) => {
  const { poolConfig, tokensMetadata } = useContext(AppContext);
  const defaultTokenPriceData: BirdeyeTokenPriceData = {
    address: project.mint,
    value: 0,
    updateUnixTime: 0,
    updateHumanTime: "",
    priceChange24h: 0,
  };

  const positionInputData = useMemo(() => {
    const position = positionsInputData.find(
      (position) => position.tokenName === project.name
    );
    if (!position) return null;
    return position;
  }, [positionsInputData, project.name]);

  const { isAllowedToPlay, pointsRemaining, positions, tokensPrices } =
    useContext(AppContext);

  const activePosition = useMemo(() => {
    const position = positions.find(
      (position) => position.tokenMint === project.mint
    );
    return position;
  }, [positions, project.mint]);

  const tokenDetails = useMemo(() => {
    const tokenPriceData = tokensPrices.find(
      (tokenPrice) => tokenPrice.address === project.mint
    );
    if (!tokenPriceData) return defaultTokenPriceData;
    return tokenPriceData;
  }, [tokensPrices, project.mint]);

  const getButtonState = () => {
    if (
      !poolConfig ||
      poolConfig.poolDepositsPaused ||
      poolConfig.poolState === "Inactive"
    )
      return "hidden";

    if (pointsRemaining === 0 || !isAllowedToPlay || activePosition) {
      return "hidden";
    }

    if (positionInputData) {
      return "update";
    }

    return "create";
  };

  return (
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            minWidth: "200px",
          }}
        >
          <Image
            src={project.logoURI}
            alt="token logo"
            width={50}
            height={50}
            style={{
              borderRadius: "50%",
            }}
          />

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
        </Box>

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
          text="Current Price"
          value={
            "$" +
            tokenDetails.value.toLocaleString("en-US", {
              maximumFractionDigits: 9,
            })
          }
          gap="5px"
        />

        <TextWithValue
          text="24Hr Change"
          value={get24Change(tokenDetails.priceChange24h)}
          gap="5px"
          endComponent={
            tokenDetails.priceChange24h > 0 ? (
              <ArrowUpward sx={{ color: "lightgreen", fontSize: "20px" }} />
            ) : (
              <ArrowDownward sx={{ color: "red", fontSize: "20px" }} />
            )
          }
        />

        <ApexChartComponent tokenAddress={project.mint} />

        {getButtonState() === "update" ? (
          <Button
            disabled={pointsRemaining === 0}
            onClick={() => {
              setModalOpen(true);
              setSelectedToken(project.name);
              setSelectedTokenAddress(project.mint);
              setSelectedTokenData(tokenDetails);
            }}
          >
            Update Position
          </Button>
        ) : getButtonState() === "create" ? (
          <Button
            disabled={pointsRemaining === 0}
            onClick={() => {
              setModalOpen(true);
              setSelectedToken(project.name);
              setSelectedTokenAddress(project.mint);
              setSelectedTokenData(tokenDetails);
            }}
          >
            Create Position
          </Button>
        ) : null}
      </Box>
      {activePosition ? (
        <RenderPositionStats
          positionInputData={activePosition}
          tokenPriceData={tokenDetails}
          positionExists={true}
        />
      ) : positionInputData ? (
        <RenderPositionStats
          positionInputData={positionInputData}
          tokenPriceData={tokenDetails}
          positionExists={false}
        />
      ) : null}
    </Card>
  );
};
