import { AppContext } from "@/components/Context/AppContext";
import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import { PoolConfig } from "@/sdk/poolConfig";
import { getExpiry, minimizePubkey } from "@/utils/helpers";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useContext } from "react";
import { useTimer } from "react-timer-hook";

export const ActiveRound = ({ poolConfig }: { poolConfig: PoolConfig }) => {
  const { poolServerId } = useContext(AppContext);
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: getExpiry(),
    onExpire: () => console.warn("onExpire"),
  });
  const smallScreen = useMediaQuery("(max-width:800px)");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        border: "1px solid white",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "40px",
        marginRight: "40px",
        marginTop: "20px",
        marginBottom: "20px",
        width: "fit-content",
        flexWrap: smallScreen ? "wrap" : "nowrap",
      }}
    >
      <Typography variant="h5" fontWeight={"bold"}>
        Pool:{" "}
        <span
          style={{
            color: "#87cefa",
          }}
        >
          {poolConfig.poolState}
        </span>
      </Typography>
      {poolConfig.poolDepositsPaused && (
        <Typography variant="h6" fontWeight={"bold"}>
          Deposits are paused, please wait for the next round
        </Typography>
      )}
      <Typography variant="h6" fontWeight={"bold"}>
        Ends in : {hours} Hours {minutes} Minutes {seconds} Seconds
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* <TextWithValue
          justifyContent="flex-start"
          text="Pool ID"
          gap="5px"
          value={minimizePubkey(poolConfig.poolAddress.toBase58())}
        /> */}
        <TextWithValue
          justifyContent="flex-start"
          text="Pool Id"
          gap="5px"
          value={poolServerId ?? ""}
        />
        {/* <TextWithValue
          justifyContent="flex-start"
          text="Pool Balance"
          gap="5px"
          value={poolConfig.poolBalance.toLocaleString()}
        /> */}
        <TextWithValue
          justifyContent="flex-start"
          text="Price Pool"
          gap="5px"
          value={poolConfig.poolBalance.toLocaleString() + " " + "BONK"}
        />

        <TextWithValue
          justifyContent="flex-start"
          text="Winning Price"
          gap="5px"
          value={
            (
              poolConfig.poolRoundWinAllocation * poolConfig.poolBalance
            ).toLocaleString() +
            " " +
            "BONK"
          }
        />
      </Box>
    </Box>
  );
};
