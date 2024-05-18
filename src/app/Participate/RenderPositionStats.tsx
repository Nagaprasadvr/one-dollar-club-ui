import { AppContext } from "@/components/Context/AppContext";
import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import { safeDivide } from "@/utils/helpers";
import { BirdeyeTokenPriceData } from "@/utils/types";
import { Divider, Box } from "@mui/material";
import { useContext, useMemo } from "react";
import { Position } from "@/sdk/Position";

export const RenderPositionStats = ({
  projectName,
  tokenPriceData,
  activePosition,
}: {
  projectName: string;
  tokenPriceData: BirdeyeTokenPriceData;
  activePosition: Position;
}) => {
  const percentageChange = useMemo(() => {
    const change =
      safeDivide(
        tokenPriceData.value - activePosition.entryPrice,
        activePosition.entryPrice
      ) * 100;

    return change.toLocaleString() + "%";
  }, [tokenPriceData, activePosition.entryPrice]);

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
          value={activePosition.positionType}
          gap="5px"
        />
        <TextWithValue
          text="Points Allocated"
          value={activePosition.pointsAllocated.toLocaleString()}
          gap="5px"
        />
        <TextWithValue
          text="Leverage"
          value={activePosition.leverage + "x"}
          gap="5px"
        />
        <TextWithValue
          text="Entry Price"
          value={
            activePosition.entryPrice.toLocaleString("en-US", {
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
      </Box>
    </>
  );
};
