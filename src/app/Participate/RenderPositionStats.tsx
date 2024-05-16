import { AppContext } from "@/components/Context/AppContext";
import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import { Divider, Box } from "@mui/material";
import { useContext, useMemo } from "react";

export const RenderPositionStats = ({
  projectName,
}: {
  projectName: string;
}) => {
  const { positions } = useContext(AppContext);

  const activePosition = useMemo(() => {
    return positions.find((position) => position.tokenName === projectName);
  }, [positions, projectName]);

  if (!activePosition) return null;

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
          value={activePosition.entryPrice.toLocaleString() ?? ""}
          gap="5px"
        />
        <TextWithValue
          text="Current Price"
          value={`$${Math.floor(Math.random() * 100)}`.toLocaleLowerCase()}
          gap="5px"
        />
        <TextWithValue
          text="Percentage Change"
          value={Math.floor(Math.random() * 100).toLocaleString() + "%"}
          gap="5px"
        />
      </Box>
    </>
  );
};
