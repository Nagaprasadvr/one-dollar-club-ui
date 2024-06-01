import { HomePage } from "@/components/Home/HomePage";
import { Box } from "@mui/material";

export default function Index() {
  return (
    <Box
      className="center"
      sx={{
        flexDirection: "column",
      }}
    >
      <HomePage />
    </Box>
  );
}
