import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";

// import { NavLinks } from "./Navbar";
import CloseIcon from "@mui/icons-material/Close";
import { usePathname, useRouter } from "next/navigation";
import { Wallet } from "./Wallet";
import { CHARCOAL } from "@/utils/constants";
import { Typography } from "@mui/material";
import { AppContext } from "../Context/AppContext";
import Link from "next/link";

export const MobDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const { pointsRemaining, sdk, resultingPoints } =
    React.useContext(AppContext);
  const router = useRouter();

  const pathName = usePathname();
  const isHomePage = React.useMemo(() => {
    return pathName === "/";
  }, [pathName]);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnClick = (link: string) => {
    router.push(link);
    setOpen(false);
  };

  const isDevnet = React.useMemo(() => {
    return sdk && sdk.connection.rpcEndpoint.includes("devnet");
  }, [sdk]);

  const DrawerList = (
    <Box
      sx={{
        width: 300,
        backgroundColor: "black",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderLeft: `0.5px solid ${CHARCOAL}`,
        gap: "20px",
      }}
      role="presentation"
    >
      <Box
        sx={{
          width: "100%",
          pl: "20px",
          pt: "20px",
          pb: "20px",
        }}
      >
        <Button onClick={handleClose} size="small">
          <CloseIcon />
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          borderTop: `1px solid ${CHARCOAL}`,
        }}
      >
        {(pathName === "/Participate" || pathName === "Faucet") && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              width: "100%",
              borderBottom: `1px solid ${CHARCOAL}`,
              p: "10px",
            }}
          >
            <Link href="/LeaderBoard">
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "#87cefa",
                    backgroundColor: "transparent",
                  },
                }}
                onClick={handleClose}
              >
                LeaderBoard
              </Button>
            </Link>
          </Box>
        )}
        {(pathName === "/LeaderBoard" || pathName === "/Faucet") && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              width: "100%",
              borderBottom: `1px solid ${CHARCOAL}`,
              p: "10px",
            }}
          >
            <Link href="/Participate">
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "#87cefa",
                    backgroundColor: "transparent",
                  },
                }}
                onClick={handleClose}
              >
                Participate
              </Button>
            </Link>
          </Box>
        )}
        {isDevnet && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              width: "100%",
              borderBottom: `1px solid ${CHARCOAL}`,
              p: "10px",
            }}
          >
            <Link href="/Faucet">
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "#87cefa",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Faucet
              </Button>
            </Link>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: isHomePage ? "none" : "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {pointsRemaining ? (
          <Box
            sx={{
              p: "10px",
              backgroundColor: "#aff6ff",
              borderRadius: "10px",
            }}
          >
            <Typography fontWeight={"bold"} fontSize={"15px"} color="black">
              Points:{" "}
              <span
                style={{
                  color: "black",
                }}
              >
                {pointsRemaining ?? 0}
              </span>
            </Typography>
          </Box>
        ) : resultingPoints ? (
          <Box
            sx={{
              p: "10px",
              backgroundColor: "#aff6ff",
              borderRadius: "10px",
            }}
          >
            <Typography fontWeight={"bold"} fontSize={"15px"} color="black">
              Resulting Points:{" "}
              <span
                style={{
                  color: "black",
                }}
              >
                {resultingPoints.toLocaleString("en-US", {
                  maximumFractionDigits: 4,
                })}
              </span>
            </Typography>
          </Box>
        ) : null}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <Wallet setOpen={setOpen} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        overflow: "hidden",
      }}
    >
      <Button
        onClick={toggleDrawer(true)}
        size="small"
        sx={{
          backgroundColor: "transparent",
          ":hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <MenuIcon color="primary" />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        {DrawerList}
      </Drawer>
    </Box>
  );
};
