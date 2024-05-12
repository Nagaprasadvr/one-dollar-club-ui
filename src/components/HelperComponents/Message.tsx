import { Box, Typography } from "@mui/material";

export const Message = ({ message }: { message: string }) => {
  return (
    <Box className="center-row">
      <Typography variant="h4">{message}</Typography>
    </Box>
  );
};
