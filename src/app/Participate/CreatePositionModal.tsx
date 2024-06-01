import { ModalContent } from "@/components/HelperComponents/ModalContent";
import { Modal } from "@/components/HelperComponents/Modal";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Slider,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CallMade, Close as CloseIcon, ContentCopy } from "@mui/icons-material";
import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL, birdeyeUrl } from "@/utils/constants";
import { AppContext } from "@/components/Context/AppContext";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  get24Change,
  getLiquidationPrice,
  minimizePubkey,
  safeDivide,
} from "@/utils/helpers";
import {
  BirdeyeTokenPriceData,
  PositionData,
  PositionInputData,
} from "@/utils/types";
import { Message } from "@/components/HelperComponents/Message";
import { Position } from "@/sdk/Position";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

export const getPlaceHolder = (data: string) => {
  switch (data) {
    case "positionType":
      return "long or short";
    case "leverage":
      return "Leverage or multiplier";
    case "pointsAllocated":
      return "Points to allocate";
    case "liquidationPrice":
      return "Liquidation Price";
    default:
      return "";
  }
};

const getLabel = (data: string) => {
  switch (data) {
    case "positionType":
      return "Position";
    case "leverage":
      return "Leverage";
    case "pointsAllocated":
      return "Points to Allocate";
    case "liquidationPrice":
      return "Liquidation Price";
    default:
      return "";
  }
};

const getType = (data: string) => {
  switch (data) {
    case "positionType":
      return "text";
    case "leverage":
      return "number";
    case "pointsAllocated":
      return "number";
    case "liquidationPrice":
      return "number";
    default:
      return "";
  }
};

export const CreatePositionModal = ({
  open,
  setOpen,
  tokenSymbol,
  tokenAddress,
  activeTokenData,
  appendPositionInputData,
  positionsInputData,
  updatePositionInputData,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  tokenSymbol: string;
  tokenAddress: string;
  activeTokenData: BirdeyeTokenPriceData;
  appendPositionInputData: (data: PositionInputData) => void;
  positionsInputData: PositionInputData[];
  updatePositionInputData: (data: PositionInputData) => void;
}) => {
  const { pointsRemaining, tokensPrices, setPositions } =
    useContext(AppContext);
  const wallet = useWallet();
  const { connected, publicKey } = useWallet();
  const [positionInputData, setPositionInputData] = useState<PositionInputData>(
    {
      tokenName: tokenSymbol,
      positionType: "long",
      leverage: 0,
      pointsAllocated: "",
      entryPrice: activeTokenData.value,
      tokenMint: tokenAddress,
    }
  );

  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);

  useEffect(() => {
    if (!positionsInputData || positionsInputData.length === 0) return;
    const previousPosition = positionsInputData.find(
      (position) => position.tokenName === tokenSymbol
    );
    if (previousPosition) {
      setPositionInputData(previousPosition);
    }
  }, [positionsInputData, tokenSymbol]);

  useEffect(() => {
    if (activeTokenData) {
      setLiquidationPrice(
        getLiquidationPrice({
          entryPrice: activeTokenData.value,
          leverage: Number(positionInputData.leverage),
          positionType: positionInputData.positionType,
        })
      );
    }
  }, [
    activeTokenData,
    positionInputData.leverage,
    positionInputData.positionType,
  ]);

  const validateData = () => {
    if (
      positionInputData.leverage === 0 ||
      positionInputData.pointsAllocated === ""
    ) {
      toast.error("Please fill all the fields");
      return false;
    }
    if (
      Number(positionInputData.leverage) <= 0 ||
      Number(positionInputData.pointsAllocated) <= 0
    ) {
      toast.error("Please fill all the fields with Non zero positive values");
      return false;
    }
    if (Number(positionInputData.pointsAllocated) > pointsRemaining!) {
      toast.error("Points allocated cannot be greater than points remaining");
      return false;
    }

    return true;
  };

  const handleCreatePosition = async () => {
    if (!connected || !publicKey || !wallet) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!activeTokenData) {
      toast.error("Token data not available");
      return;
    }
    if (!validateData()) return;

    const position: PositionData = {
      pubkey: publicKey.toBase58(),
      tokenName: tokenSymbol,
      tokenMint: tokenAddress,
      entryPrice: activeTokenData.value,
      leverage: Number(positionInputData.leverage),
      pointsAllocated: Number(positionInputData.pointsAllocated),
      positionType: positionInputData.positionType,
      liquidationPrice: getLiquidationPrice({
        entryPrice: activeTokenData.value,
        leverage: Number(positionInputData.leverage),
        positionType: positionInputData.positionType,
      }),
    };

    const previousPositionExists = positionsInputData?.find(
      (position) => position.tokenName === tokenSymbol
    );

    if (previousPositionExists) {
      updatePositionInputData(position);
      toast.success("Position updated successfully");
      setOpen(false);
      return;
    }
    appendPositionInputData(position);
    toast.success("Position saved successfully");
    setOpen(false);
  };

  const midScreen = useMediaQuery("(max-width:1450px)");

  const marks = [
    {
      value: 5,
      label: "5x",
    },
    {
      value: 15,
      label: "15x",
    },
    {
      value: 25,
      label: "25x",
    },
    {
      value: 50,
      label: "50x",
    },
    {
      value: 75,
      label: "75x",
    },
    {
      value: 100,
      label: "100x",
    },
  ];

  const handleLeverageChange = (event: any, newValue: number | number[]) => {
    setPositionInputData({
      ...positionInputData,
      leverage: newValue as number,
    });
  };

  if (!activeTokenData) return <Message message="Loading..." />;
  return (
    <Modal isOpen={open}>
      <ModalContent
        sx={{
          width: "30vw",
          padding: "20px",
          minWidth: "250px",
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
            Create Positions
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: midScreen ? "column" : "row",
              justifyContent: "space-between",
              width: "100%",
              gap: "20px",
            }}
          >
            <TextWithValue
              text="Token Symbol"
              value={tokenSymbol}
              gap="5px"
              endComponent={
                <Tooltip title="Click to view project on Birdeye">
                  <IconButton
                    onClick={() => {
                      window.open(
                        `${birdeyeUrl}${tokenAddress}?chain=solana`,
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
              text="Token Address"
              value={minimizePubkey(tokenAddress)}
              gap="5px"
              endComponent={
                <Tooltip title="Copy Token Address">
                  <IconButton
                    onClick={() => {
                      toast.success("Token Address Copied");
                      navigator.clipboard.writeText(tokenAddress);
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
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: midScreen ? "column" : "row",
              justifyContent: "space-between",
              width: "100%",
              gap: "20px",
            }}
          >
            <TextWithValue
              text="Current Price"
              value={
                activeTokenData.value.toLocaleString("en-US", {
                  maximumFractionDigits: 9,
                }) ?? ""
              }
              gap="5px"
            />
            <TextWithValue
              text="24Hr Change"
              value={get24Change(activeTokenData.priceChange24h)}
              gap="5px"
              endComponent={
                activeTokenData.priceChange24h > 0 ? (
                  <ArrowUpward sx={{ color: "lightgreen", fontSize: "20px" }} />
                ) : (
                  <ArrowDownward sx={{ color: "red", fontSize: "20px" }} />
                )
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
              padding: "20px",
            }}
          >
            <FormControl>
              <FormLabel
                id="demo-radio-buttons-group-label"
                sx={{
                  fontWeight: "bold",
                  fontSize: "15px",
                  color: "#87cefa",
                }}
              >
                Position
              </FormLabel>
              <RadioGroup
                value={positionInputData.positionType}
                row
                name="radio-buttons-group"
                onChange={(e) => {
                  setPositionInputData({
                    ...positionInputData,
                    positionType: e.target.value as "long" | "short",
                  });
                }}
              >
                <FormControlLabel
                  value="long"
                  control={<Radio size="small" />}
                  label="Long"
                />
                <FormControlLabel
                  value="short"
                  control={<Radio size="small" />}
                  label="Short"
                />
              </RadioGroup>
            </FormControl>
            <TextWithValue
              text="Liquidation Price"
              value={liquidationPrice.toLocaleString("en-US", {
                maximumFractionDigits: 9,
              })}
              gap="5px"
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              <Typography
                color={"primary"}
                sx={{
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Levergae :{" "}
                <span
                  style={{
                    color: "white",
                  }}
                >
                  {positionInputData.leverage}x
                </span>
              </Typography>
              <Slider
                defaultValue={positionInputData.leverage}
                aria-label="Default"
                valueLabelDisplay="auto"
                sx={{
                  width: "90%",
                }}
                marks={marks}
                onChange={handleLeverageChange}
              />
            </Box>
            <Box>
              <Typography fontSize={"15px"} color="primary" fontWeight={"bold"}>
                {getLabel("pointsAllocated")} (Remaining: {pointsRemaining})
              </Typography>
              <Input
                value={
                  positionInputData[
                    "pointsAllocated" as keyof PositionInputData
                  ]
                }
                placeholder={getPlaceHolder("pointsAllocated")}
                type={getType("pointsAllocated")}
                onChange={(e) =>
                  setPositionInputData({
                    ...positionInputData,
                    ["pointsAllocated"]: e.target.value,
                  })
                }
              />
            </Box>
          </Box>
          <Button onClick={handleCreatePosition}>Confirm</Button>
        </Box>
      </ModalContent>
    </Modal>
  );
};
