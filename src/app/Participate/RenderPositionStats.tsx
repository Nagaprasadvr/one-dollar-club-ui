import { AppContext } from "@/components/Context/AppContext";
import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import {
  calculateResult,
  getLiquidationPrice,
  safeDivide,
} from "@/utils/helpers";
import { BirdeyeTokenPriceData, PositionInputData } from "@/utils/types";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Divider, Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export const RenderPositionStats = ({
  tokenPriceData,
  positionInputData,
  positionExists,
}: {
  tokenPriceData: BirdeyeTokenPriceData;
  positionInputData: PositionInputData;
  positionExists: boolean;
}) => {
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);
  const percentageChange = useMemo(() => {
    const change =
      safeDivide(
        tokenPriceData.value - positionInputData.entryPrice,
        positionInputData.entryPrice
      ) * 100;

    return change.toLocaleString() + "%";
  }, [tokenPriceData, positionInputData.entryPrice]);

  useEffect(() => {
    if (tokenPriceData && positionInputData)
      if (positionExists) {
        setLiquidationPrice(
          getLiquidationPrice({
            positionType: positionInputData.positionType,
            entryPrice: positionInputData.entryPrice,
            leverage: positionInputData.leverage,
          })
        );
      } else {
        setLiquidationPrice(
          getLiquidationPrice({
            positionType: positionInputData.positionType,
            entryPrice: tokenPriceData.value,
            leverage: positionInputData.leverage,
          })
        );
      }
  }, [tokenPriceData, positionInputData]);

  const calculatedResult = useMemo(() => {
    return calculateResult({
      entryPrice: positionInputData.entryPrice,
      leverage: positionInputData.leverage,
      currentPrice: tokenPriceData.value,
      liquidationPrice,
      pointsAllocated: Number(positionInputData.pointsAllocated),
      positionType: positionInputData.positionType,
    });
  }, [positionInputData, tokenPriceData, liquidationPrice]);

  return (
    <>
      <Divider
        sx={{
          color: "white",
          height: "1px",
          width: "100%",
          backgroundColor: "white",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "10px",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridColumnGap: "10px",
            gridRowGap: "10px",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TextWithValue
            text="Position"
            value={positionInputData.positionType}
            gap="5px"
          />
          <TextWithValue
            text="Points Allocated"
            value={positionInputData.pointsAllocated.toLocaleString()}
            gap="5px"
          />
          <TextWithValue
            text="Leverage"
            value={positionInputData.leverage + "x"}
            gap="5px"
          />
          <TextWithValue
            text="Entry Price"
            value={
              positionInputData.entryPrice.toLocaleString("en-US", {
                maximumFractionDigits: 9,
              }) ?? ""
            }
            gap="5px"
          />
          <TextWithValue
            text="Current Price"
            value={
              tokenPriceData.value.toLocaleString("en-US", {
                maximumFractionDigits: 9,
              }) ?? ""
            }
            gap="5px"
          />
          <TextWithValue
            text="Percentage Change"
            value={percentageChange ?? ""}
            gap="5px"
          />
          <TextWithValue
            text="Liquidation Price"
            value={
              liquidationPrice.toLocaleString("en-US", {
                maximumFractionDigits: 9,
              }) ?? ""
            }
            gap="5px"
          />
        </Box>
        <Box>
          <TextWithValue
            text="Resulting Points"
            value={calculatedResult.toLocaleString()}
            gap="5px"
            endComponent={
              Number(positionInputData.pointsAllocated) <= calculatedResult ? (
                <ArrowUpward sx={{ color: "lightgreen", fontSize: "20px" }} />
              ) : (
                <ArrowDownward sx={{ color: "red", fontSize: "20px" }} />
              )
            }
          />
        </Box>
      </Box>
    </>
  );
};
