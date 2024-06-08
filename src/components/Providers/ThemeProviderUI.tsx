"use client";
import { CHARCOAL } from "@/utils/constants";
import { ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#87cefa",
    },
    secondary: {
      main: "#aff6ff",
    },
    error: {
      main: "#ff0707",
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", sans-serif',
    fontSize: 18,
    fontWeightRegular: 550,
    fontWeightBold: 700,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "18px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          multiline: {
            fontWeight: "bold",
            fontSize: "18px",
            color: "white",
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          zIndex: 9999,
          color: "white",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "white",
          backgroundColor: "black",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: "black",
          backgroundColor: "#87cefa",
          textTransform: "none",
          fontWeight: "700",
          width: "fit-content",
          minWidth: "fit-content",
          height: "fit-content",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
          justifyItems: "center",
          fontSize: "18px",

          "&:hover": {
            backgroundColor: "#aff6ff",
            color: "black",
          },
          "&:disabled": {
            backgroundColor: "#87cefa",
            color: "grey",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#36454F",
          color: "whitesmoke",
          fontSize: "15px",
          fontWeight: "bold",
          borderRadius: "10px",
          padding: "10px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "15px",
        },
      },
    },
    MuiInput: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: {
        root: {
          paddingTop: "13px",
        },
        input: {
          "::placeholder": {
            fontSize: "14px",
          },
          backgroundColor: CHARCOAL,
          borderRadius: "10px",
          padding: "10px",
          fontSize: "16px",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "15px",
          fontWeight: "bold",
        },
      },
    },
    MuiSlider: {
      defaultProps: {
        valueLabelDisplay: "on",
      },
      styleOverrides: {
        valueLabel: {
          backgroundColor: "black",
          border: `2px solid ${CHARCOAL}`,
          color: "#87cefa",
        },
        markLabel: {
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: "15px",
          fontWeight: "bold",
          fontFamily: '"Roboto Mono", sans-serif',
        },
      },
    },
  },
});

export const ThemeProviderUI = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
};
