import { Box, Typography, useTheme } from "@mui/material";

export const TextWithValue = ({
  text,
  value,
  flexDirection = "column",
  gap = "2px",
  justifyContent = "space-between",
  separator = "",
}: {
  text: string;
  value: string;
  flexDirection?: string;
  gap?: string;
  justifyContent?: string;
  separator?: string;
}) => {
  const { palette } = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection,
        gap,
        width: "100%",
        justifyContent: justifyContent,
      }}
    >
      <Typography
        sx={{
          color: palette.primary.main,
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {text}
      </Typography>
      <Typography
        sx={{
          display: separator ? "block" : "none",
        }}
        color="inherit"
      >
        {separator}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Typography color="inherit" fontWeight={"bold"}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};
