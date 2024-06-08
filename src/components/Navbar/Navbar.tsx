"use client";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Logo } from "../Logo/Logo";
import { Wallet } from "./Wallet";
import { MobileNav } from "./MobileNav";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export const Navbar = () => {
  const { breakpoints } = useTheme();
  const mobileScreen = useMediaQuery(breakpoints.down("md"));
  const { pointsRemaining, resultingPoints } = useContext(AppContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const pathName = usePathname();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  });

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        top: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: pathName === "/" ? "flex-start" : "space-around",
          alignItems: "center",
          width: "100%",
          height: "50px",
          backgroundColor: "transparent",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            ml: !mobileScreen && pathName === "/" ? "100px" : "0px",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            gap="10px"
            ml="10px"
            width={mobileScreen ? "10%" : "20%"}
            minWidth={"250px"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => {
              router.push("/");
            }}
          >
            <Logo size={30} />
          </Box>

          <Box
            display={mobileScreen || pathName === "/" ? "none" : "flex"}
            flexDirection={"row"}
            gap="10px"
            ml="10px"
            width={mobileScreen ? "10%" : "20%"}
            minWidth={"250px"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            sx={{
              cursor: "pointer",
            }}
          >
            {pathName === "/Participate" && (
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
                >
                  LeaderBoard
                </Button>
              </Link>
            )}
            {pathName === "/LeaderBoard" && (
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
                >
                  Participate
                </Button>
              </Link>
            )}
          </Box>
        </Box>

        {isLoading ? (
          <Box
            sx={{
              p: "10px",
            }}
          >
            <CircularProgress
              size={30}
              thickness={6}
              sx={{
                color: "primary",
              }}
            />
          </Box>
        ) : pathName !== "/" && mobileScreen ? (
          <Box
            sx={{
              display: mobileScreen ? "flex" : "none",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <MobileNav />
          </Box>
        ) : (
          <Box
            display={mobileScreen || pathName === "/" ? "none" : "flex"}
            sx={{
              mr: "20px",
              ml: "20px",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
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
                <Typography fontWeight={"bold"} fontSize={"18px"} color="black">
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
                <Typography fontWeight={"bold"} fontSize={"18px"} color="black">
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

            <Wallet setOpen={null} />
          </Box>
        )}
      </Box>
    </nav>
  );
};
