import { TextWithValue } from "@/components/HelperComponents/TextWithValue";
import { PoolConfig } from "@/sdk/poolConfig";
import { getExpiry, minimizePubkey } from "@/utils/helpers";
import { Box, Typography } from "@mui/material";
import { useTimer } from "react-timer-hook";

export const ActiveRound = ({ poolConfig }: { poolConfig: PoolConfig }) => {
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
      }}
    >
      <Typography variant="h4" fontWeight={"bold"}>
        Active Round
      </Typography>
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
          text="Pool State"
          gap="5px"
          value={poolConfig.poolState}
        />
        {/* <TextWithValue
          justifyContent="flex-start"
          text="Pool Balance"
          gap="5px"
          value={poolConfig.poolBalance.toLocaleString()}
        /> */}
        <TextWithValue
          justifyContent="flex-start"
          text="Pool Deposit"
          gap="5px"
          value={poolConfig.poolDepositPerUser.toLocaleString() + "USDC"}
        />

        <TextWithValue
          justifyContent="flex-start"
          text="Winning Price"
          gap="5px"
          value={
            (
              poolConfig.poolRoundWinAllocation * poolConfig.poolBalance
            ).toLocaleString() + "USDC"
          }
        />
      </Box>
    </Box>
  );
};
