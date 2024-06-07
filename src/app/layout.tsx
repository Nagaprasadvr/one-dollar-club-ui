"use client";
import "../styles/globals.css";
import { ProviderUI } from "@/components/Providers/ProviderUI";
import { Box, useMediaQuery } from "@mui/material";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { Message } from "@/components/HelperComponents/Message";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        ></meta>
      </head>
      <body>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto+Mono"
          type="text/css"
        ></link>
        <ProviderUI>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Navbar />

            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: "90vh",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {children}
            </Box>
            <Footer />
          </Box>
        </ProviderUI>
      </body>
    </html>
  );
}
