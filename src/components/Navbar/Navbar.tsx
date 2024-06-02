"use client";
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Logo } from "../Logo/Logo";
import { Wallet } from "./Wallet";
import { MobileNav } from "./MobileNav";
import React, { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../Context/AppContext";
import { usePathname, useRouter } from "next/navigation";

// export const NavLinks = [
//   { name: "Home", link: "/" },
//   {
//     name: "Participate",
//     link: "/Participate",
//   },
// ];

export const Navbar = () => {
  const { breakpoints } = useTheme();
  const mobileScreen = useMediaQuery(breakpoints.down("md"));
  const { pointsRemaining } = useContext(AppContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const pathName = usePathname();

  const isHomePage = useMemo(() => {
    return pathName === "/";
  }, [pathName]);

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
          justifyContent:
            !mobileScreen && isHomePage ? "flex-start" : "space-around",
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
            ml: !mobileScreen && isHomePage ? "100px" : "0px",
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

          {/* <Box
            sx={{
              display: mobileScreen ? "none" : "flex",
              gap: "10px",
              justifyContent: "center",
              paddingRight: "20px",
            }}
          >
            {NavLinks.map((nav) => (
              <Link
                href={nav.link}
                key={nav.name}
                style={{
                  width: "auto",
                }}
              >
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "transparent",
                    "&:hover": {
                      color: "white",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {nav.name}
                </Button>
              </Link>
            ))}
          </Box> */}
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
        ) : mobileScreen ? (
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
            display={mobileScreen || isHomePage ? "none" : "flex"}
            sx={{
              mr: "20px",
              ml: "20px",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {pointsRemaining !== null && (
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
            )}

            <Wallet setOpen={null} />
          </Box>
        )}
      </Box>
    </nav>
  );
};
