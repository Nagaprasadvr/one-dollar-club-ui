"use client";
import {
  ExtendedLeaderBoardDataType,
  LeaderBoardDataType,
} from "@/utils/types";
import { useEffect, useState } from "react";
import React from "react";
import { DataGrid, GridColDef, GridKeyValue } from "@mui/x-data-grid";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import {
  fetchLeaderBoards,
  fetchYourStats,
  getRow,
  minimizePubkey,
} from "@/utils/helpers";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { useWallet } from "@solana/wallet-adapter-react";
const LeaderBoardHeaders = [
  {
    name: "Rank",
    key: "id",
  },
  {
    name: "Pubkey",
    key: "pubkey",
  },
  {
    name: "Points Allocated",
    key: "pointsAllocated",
  },

  {
    name: "Pool Id",
    key: "poolId",
  },

  {
    name: "Resulting Points",
    key: "finalPoints",
  },

  {
    name: "Top 3 Positions",
    key: "top3Positions",
  },
];

const YourStatsHeadingMap = {
  pubkey: "Pubkey",
  pointsAllocated: "Points Allocated",
  poolId: "Pool Id",
  finalPoints: "Resulting Points",
  top3Positions: "Top 3 Positions",
};

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState<
    ExtendedLeaderBoardDataType[]
  >([]);

  const wallet = useWallet();
  const [yourStats, setYourStats] =
    useState<ExtendedLeaderBoardDataType | null>(null);

  useEffect(() => {
    const getLeaderBoardData = async () => {
      const leaderBoardData: LeaderBoardDataType[] = await fetchLeaderBoards();

      if (leaderBoardData.length === 0) return;
      const extendedLeaderBoardData = leaderBoardData.map((data, index) => ({
        ...data,
        id: index + 1,
      }));
      setLeaderboardData(extendedLeaderBoardData);
    };
    const getYourStats = async () => {
      if (!wallet?.connected || !wallet?.publicKey) return;
      const yourStats = await fetchYourStats(wallet.publicKey.toString());
      if (!yourStats) return;
      setYourStats(yourStats);
    };

    if (leaderboardData.length === 0) getLeaderBoardData();
    if (wallet?.connected && wallet?.publicKey && !yourStats) getYourStats();

    const id = setInterval(() => {
      getLeaderBoardData();
      if (wallet?.connected && wallet?.publicKey) getYourStats();
    }, 1000 * 60 * 10);

    return () => {
      clearInterval(id);
    };
  }, [wallet]);

  const columns: GridColDef[] = LeaderBoardHeaders.map((header) => {
    if (header.key === "top3Positions") {
      return {
        field: header.key,
        headerName: header.name,
        width: 350,
        renderCell: (params) => {
          const thisRow: Record<string, GridKeyValue> = getRow(params);
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {thisRow["top3Positions"]}
            </Box>
          );
        },
      };
    }
    if (header.key === "pubkey") {
      return {
        field: header.key,
        headerName: header.name,
        width: 250,
        renderCell: (params) => {
          const thisRow: Record<string, GridKeyValue> = getRow(params);
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Tooltip title={thisRow["pubkey"] as string}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    fontWeight={"bold"}
                    fontSize={"18px"}
                    sx={{
                      padding: "5px",
                      borderRadius: "10px",
                    }}
                  >
                    {minimizePubkey(thisRow["pubkey"] as string)}
                  </Typography>
                  <Button
                    sx={{
                      backgroundColor: "transparent",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "white",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CopyIcon
                      sx={{
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    />
                  </Button>
                </Box>
              </Tooltip>
            </Box>
          );
        },
      };
    }
    if (header.key === "poolId") {
      return {
        field: header.key,
        headerName: header.name,
        width: 300,
      };
    }
    return {
      field: header.key,
      headerName: header.name,
      width: 250,
    };
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        gap: "20px",
        height: "auto",
        maxHeight: "80vh",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: yourStats ? "flex" : "none",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          Your Stats
        </Typography>

        <Box
          sx={{
            border: "1px solid white",
            width: "90%",
            display: yourStats ? "flex" : "none",
            flexDirection: "row",
            borderRadius: "10px",
            padding: "20px",
            overflow: "auto",
            gap: "40px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {yourStats &&
            Object.entries(yourStats).map((stat) => (
              <Box
                key={stat[0]}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    width: "100%",
                    textAlign: "left",
                    color: "#aff6ff",
                    textWrap: "nowrap",
                  }}
                >
                  {
                    YourStatsHeadingMap[
                      stat[0] as keyof typeof YourStatsHeadingMap
                    ]
                  }
                </Typography>
                {stat[0] === "pubkey" ? (
                  <Typography
                    sx={{
                      fontSize: "20px",
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                      textWrap: "nowrap",
                    }}
                  >
                    {minimizePubkey(String(stat[1]))}
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "20px",
                      width: "100%",
                      textAlign: "left",
                      fontWeight: "bold",
                      textWrap: "nowrap",
                    }}
                  >
                    {stat[1]}
                  </Typography>
                )}
              </Box>
            ))}
        </Box>
      </Box>
      <Typography
        sx={{
          textAlign: "start",
          fontSize: "30px",
          fontWeight: "bold",
        }}
      >
        LeaderBoard
      </Typography>

      {leaderboardData.length > 0 && (
        <DataGrid
          sx={{
            width: "90%",
            ".MuiDataGrid-cell": {
              color: "whitesmoke",
              fontWeight: "bold",
              backgroundColor: "transparent",
            },
            ".css-t89xny-MuiDataGrid-columnHeaderTitle": {
              color: "#aff6ff",
              fontWeight: "bold",
              fontSize: "18px",
            },
            borderCollapse: "white",
          }}
          rows={leaderboardData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      )}
    </Box>
  );
};

export default LeaderBoard;
