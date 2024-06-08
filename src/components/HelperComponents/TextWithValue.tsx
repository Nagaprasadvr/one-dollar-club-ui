import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

export const TextWithValue = ({
  text,
  value,
  flexDirection = "column",
  gap = "2px",
  justifyContent = "space-between",
  separator = "",
  startComponent,
  endComponent,
}: {
  text: string;
  value: string;
  flexDirection?: string;
  gap?: string;
  justifyContent?: string;
  separator?: string;
  startComponent?: React.ReactElement;
  endComponent?: React.ReactElement;
}) => {
  const { breakpoints } = useTheme();
  const mobScreen = useMediaQuery(breakpoints.down("sm"));
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
          fontSize: mobScreen ? "13px" : "14px",
          textWrap: "nowrap",
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
          gap: "2px",
          alignItems: "center",
        }}
      >
        {startComponent}
        <Typography
          color="inherit"
          fontWeight={"bold"}
          sx={{
            fontSize: "18px",
            textWrap: "nowrap",
          }}
        >
          {value}
        </Typography>
        {endComponent}
      </Box>
    </Box>
  );
};
