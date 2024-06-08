"use client";
import {
  ExtendedLeaderBoardDataType,
  ExtendedLeaderBoardHistory,
  LeaderBoardDataType,
  LeaderBoardHistory,
} from "@/utils/types";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { DataGrid, GridColDef, GridKeyValue } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Icon,
  IconButton,
  Tab,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  calculateTop3Positions,
  fetchLeaderBoardHistory,
  fetchLeaderBoards,
  fetchYourStats,
  getRow,
  getTotalPoints,
  minimizePubkey,
} from "@/utils/helpers";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { useWallet } from "@solana/wallet-adapter-react";
import { InfoRounded } from "@mui/icons-material";
import { AppContext } from "@/components/Context/AppContext";
import toast from "react-hot-toast";
import { TabContext, TabList, TabPanel } from "@mui/lab";
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

  const [leaderboardHistory, setLeaderboardHistory] = useState<
    ExtendedLeaderBoardHistory[]
  >([]);
  const smallScreen = useMediaQuery("(max-width:800px)");
  const wallet = useWallet();
  const { resultingPoints, positions, poolServerId, tokensPrices } =
    useContext(AppContext);
  const [yourStats, setYourStats] = useState<LeaderBoardDataType | null>(null);
  const [fetchingLeaderBoardData, setFetchingLeaderBoardData] =
    useState<boolean>(false);

  const [tabValue, setTabValue] = useState("1");
  useEffect(() => {
    const getLeaderBoardData = async () => {
      try {
        setFetchingLeaderBoardData(true);
        toast.loading("fetching Leaderboard data...", {
          id: "leaderboard-data",
        });
        const leaderBoardData: LeaderBoardDataType[] =
          await fetchLeaderBoards();

        if (leaderBoardData.length === 0) {
          setFetchingLeaderBoardData(false);
          return;
        }

        const extendedLeaderBoardData = leaderBoardData.map((data, index) => ({
          ...data,
          id: index + 1,
        }));
        setLeaderboardData(extendedLeaderBoardData);

        toast.success("Leaderboard data fetched successfully", {
          id: "leaderboard-data",
        });
      } catch (e) {
        toast.error("Error fetching Leaderboard data", {
          id: "leaderboard-data",
        });
      } finally {
        setFetchingLeaderBoardData(false);
        toast.dismiss("leaderboard-data");
      }
    };

    const getLeaderBoardHistory = async () => {
      console.log("trigger");
      try {
        setFetchingLeaderBoardData(true);
        const leaderBoardHistory: LeaderBoardHistory[] =
          await fetchLeaderBoardHistory();
        if (leaderBoardHistory.length === 0) return;
        const extendedLeaderBoardHistory = leaderBoardHistory.map(
          (data, index) => ({
            ...data,
            id: index + 1,
          })
        );
        setLeaderboardHistory(extendedLeaderBoardHistory);
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingLeaderBoardData(false);
      }
    };

    if (leaderboardData.length === 0) getLeaderBoardData();
    if (leaderboardHistory.length === 0) getLeaderBoardHistory();

    const id = setInterval(() => {
      getLeaderBoardData();
    }, 1000 * 60 * 10);

    return () => {
      clearInterval(id);
    };
  }, [wallet, positions, resultingPoints, poolServerId, tokensPrices]);

  useEffect(() => {
    const getYourStats = () => {
      if (
        positions.length === 0 ||
        resultingPoints === null ||
        poolServerId === null ||
        tokensPrices.length === 0
      )
        return;

      const yourStats: LeaderBoardDataType = {
        pointsAllocated: getTotalPoints(positions),
        finalPoints: resultingPoints,
        poolId: poolServerId,
        pubkey: wallet.publicKey?.toBase58() as string,
        top3Positions: calculateTop3Positions(positions, tokensPrices),
      };
      setYourStats(yourStats);
    };

    if (yourStats === null) getYourStats();

    const id = setInterval(() => {
      getYourStats();
    }, 1000 * 30);

    return () => {
      clearInterval(id);
    };
  });

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

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
        overflowY: "auto",
        overflowX: "hidden",
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
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
          <Tooltip title="Note that Your Stats Data and Leaderboard data can be out of sync because Leaderboard data is calculated at the backend">
            <IconButton>
              <InfoRounded />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            border: "1px solid white",
            width: smallScreen ? "80%" : "90%",
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

      <TabContext value={tabValue}>
        <TabList
          onChange={handleChange}
          variant="scrollable"
          sx={{
            margin: "20px",
          }}
        >
          <Tab value="1" label="Live LeaderBoard" />
          <Tab value="2" label="LeaderBoard history" />
        </TabList>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              textAlign: "start",
              fontSize: "30px",
              fontWeight: "bold",
            }}
          >
            {fetchingLeaderBoardData
              ? "Fetching..."
              : leaderboardData.length > 0
              ? "LeaderBoard"
              : "No positions created yet"}
          </Typography>
          <Tooltip
            title={
              tabValue === "1"
                ? "Live LeaderBoard is updated every 10 min in the backend"
                : "LeaderBoard history is updated after each round ends"
            }
          >
            <IconButton>
              <InfoRounded />
            </IconButton>
          </Tooltip>
        </Box>
        <TabPanel
          value="1"
          sx={{
            width: "95%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {leaderboardData.length > 0 ? (
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
          ) : (
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Syncing...
            </Typography>
          )}
        </TabPanel>
        <TabPanel
          value="2"
          sx={{
            width: "95%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {leaderboardHistory.length > 0 ? (
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
              rows={leaderboardHistory}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          ) : (
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Syncing...
            </Typography>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default LeaderBoard;
