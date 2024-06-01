"use client";
import { LeaderBoardDataType } from "@/utils/types";
import { useEffect, useState } from "react";
import { generateDummyData } from "./dummyData";
import React from "react";
import { DataGrid, GridColDef, GridKeyValue } from "@mui/x-data-grid";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { getRow, minimizePubkey } from "@/utils/helpers";
import CopyIcon from "@mui/icons-material/ContentCopy";
const LeaderBoardHeaders = [
  {
    name: "id",
    key: "id",
  },
  {
    name: "Rank",
    key: "rank",
  },
  {
    name: "Pubkey",
    key: "pubkey",
  },
  {
    name: "Total Points",
    key: "totalPoints",
  },
  {
    name: "Top Gainer",
    key: "topGainer",
  },
  {
    name: "Total Positions",
    key: "totalPositions",
  },
  {
    name: "Total Wins",
    key: "totalWins",
  },
  {
    name: "Total Losses",
    key: "totalLosses",
  },
  {
    name: "Avg Leverage",
    key: "avgLeverage",
  },
  {
    name: "Top 3 Positions",
    key: "top3Positions",
  },
];

const yourStats = [
  {
    name: "Rank",
    value: 1,
  },
  {
    name: "Pubkey",
    value: "F3L3Wq7vK2JZ7L6V5y9X",
  },
  {
    name: "Total Points",
    value: 100,
  },
  {
    name: "Total Positions",
    value: 10,
  },
  {
    name: "Total Wins",
    value: 5,
  },
  {
    name: "Total Losses",
    value: 5,
  },
  {
    name: "Avg Leverage",
    value: 10,
  },
  {
    name: "Top Gainer",
    value: "SAMO",
  },
  {
    name: "Top 3 Positions",
    value: "SAMO, COPE, WOOP",
  },
];

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderBoardDataType[]>(
    []
  );

  useEffect(() => {
    setLeaderboardData(generateDummyData());
  }, []);

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
        width: 200,
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
    return {
      field: header.key,
      headerName: header.name,
      width: 150,
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
      }}
    >
      <Box
        sx={{
          display: "flex",
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
            display: "flex",
            flexDirection: "row",
            borderRadius: "10px",
            padding: "20px",
            overflow: "auto",
            gap: "40px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {yourStats.map((stat) => (
            <Box
              key={stat.name}
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
                {stat.name}
              </Typography>
              {stat.name === "Pubkey" ? (
                <Typography
                  sx={{
                    fontSize: "20px",
                    width: "100%",
                    textAlign: "left",
                    fontWeight: "bold",
                    textWrap: "nowrap",
                  }}
                >
                  {minimizePubkey(String(stat.value))}
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
                  {stat.value}
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
