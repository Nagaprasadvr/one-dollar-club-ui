import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ProviderUI } from "@/components/Providers/ProviderUI";
import { Box } from "@mui/material";
import { Navbar } from "@/components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
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

            <Box>{children}</Box>
          </Box>
        </ProviderUI>
      </body>
    </html>
  );
}