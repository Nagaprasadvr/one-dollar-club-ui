import {
  API_BASE_URL,
  HELIUS_MAINNET_RPC_ENDPOINT,
  MAINNET_POOL_CONFIG_PUBKEY,
  PROJECTS_TO_PLAY,
} from "@/utils/constants";
import { Connection } from "@solana/web3.js";
import { createContext, useEffect, useMemo, useState } from "react";

import * as solana from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PoolConfig } from "@/sdk/poolConfig";
import { SDK, UIWallet } from "@/sdk/sdk";
import { Position } from "@/sdk/Position";
import {
  BirdeyeTokenPriceData,
  JupTokenInfo,
  NFTPointsData,
  PoolConfigAccount,
  TokenPriceHistory,
} from "@/utils/types";
import {
  calculateResultingPoints,
  fetchPoolConfigFromAPI,
  fetchTokenChartData,
  getTokenPriceExpiryTimeStamp,
} from "@/utils/helpers";
import toast from "react-hot-toast";
import axios from "axios";

interface AppContextType {
  connection: Connection;
  poolConfig: PoolConfig | null;
  sdk: SDK | null;
  isFetchingPoolConfig: boolean | null;
  setSdk: (sdk: SDK | null) => void;
  setPoolConfig: (poolConfig: PoolConfig | null) => void;
  poolServerId: string | null;
  setPoolServerId: (poolServerId: string | null) => void;
  isAllowedToPlay: boolean | null;
  setIsAllowedToPlay: (isAllowedToPlay: boolean) => void;
  pointsRemaining: number | null;
  setPointsRemaining: (pointsRemaining: number | null) => void;
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  tokensPrices: BirdeyeTokenPriceData[];
  setTokensPrices: (tokenPrices: BirdeyeTokenPriceData[]) => void;
  tokensPriceHistory: TokenPriceHistory[];
  setTokensPriceHistory: (tokenPriceHistory: TokenPriceHistory[]) => void;
  triggerRefetchUserData: boolean;
  setTriggerRefetchUserData: (triggerRefetchUserData: boolean) => void;
  fetchedTokensPrices: boolean;
  setFetchedTokensPrices: (fetchedTokensPrices: boolean) => void;
  tokenPriceLastUpdated: number | null;
  setTokenPriceLastUpdated: (tokenPriceLastUpdated: number | null) => void;
  footerModalOpen: boolean;
  setFooterModalOpen: (footerOpen: boolean) => void;
  footerDataToDisplay: string;
  setFooterDataToDisplay: (footerDataToDisplay: string) => void;
  resultingPoints: number | null;
  setResultingPoints: (resultingPoints: number | null) => void;
  updatePoolConfig: () => Promise<void>;
  resetUserData: () => void;
  gamesPlayed: number | null;
  tokensMetadata: JupTokenInfo[];
  nftPointsData: NFTPointsData[];
}

export const AppContext = createContext<AppContextType>({
  connection: new Connection(HELIUS_MAINNET_RPC_ENDPOINT, "confirmed"),
  poolConfig: null,
  sdk: null,
  isFetchingPoolConfig: false,
  setSdk: () => {},
  setPoolConfig: () => {},
  poolServerId: null,
  setPoolServerId: () => {},
  isAllowedToPlay: null,
  setIsAllowedToPlay: () => {},
  pointsRemaining: null,
  setPointsRemaining: () => {},
  positions: [],
  setPositions: () => {},
  tokensPrices: [],
  setTokensPrices: () => {},
  tokensPriceHistory: [],
  setTokensPriceHistory: () => {},
  triggerRefetchUserData: false,
  setTriggerRefetchUserData: () => {},
  fetchedTokensPrices: false,
  setFetchedTokensPrices: () => {},
  tokenPriceLastUpdated: 0,
  setTokenPriceLastUpdated: () => {},
  footerModalOpen: true,
  setFooterModalOpen: () => {},
  footerDataToDisplay: "Steps",
  setFooterDataToDisplay: () => {},
  resultingPoints: null,
  setResultingPoints: () => {},
  updatePoolConfig: async () => {},
  resetUserData: () => {},
  gamesPlayed: null,
  tokensMetadata: [],
  nftPointsData: [],
});
export const API_URL = "/api/birdeye";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { publicKey, connected } = useWallet();
  const [isFetchingPoolConfig, setIsFetchingPoolConfig] = useState<
    boolean | null
  >(null);
  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null);
  const [isAllowedToPlay, setIsAllowedToPlay] = useState<boolean | null>(null);
  const connection = useMemo(
    () => new Connection(HELIUS_MAINNET_RPC_ENDPOINT, "confirmed"),
    []
  );

  const [tokensMetadata, setTokensMetadata] = useState<JupTokenInfo[]>([]);
  const [footerModalOpen, setFooterModalOpen] = useState<boolean>(true);
  const [nftPointsData, setNFTPointsData] = useState<NFTPointsData[]>([]);
  const [poolConfig, setPoolConfig] = useState<PoolConfig | null>(null);
  const [sdk, setSdk] = useState<SDK | null>(null);
  const [poolServerId, setPoolServerId] = useState<string | null>(null);
  const wallet = useWallet();
  const [pointsRemaining, setPointsRemaining] = useState<number | null>(null);
  const [tokensPrices, setTokensPrices] = useState<BirdeyeTokenPriceData[]>([]);
  const [fetchedTokensPrices, setFetchedTokensPrices] =
    useState<boolean>(false);
  const [fetchedChartsData, setFetchedChartsData] = useState<boolean>(false);
  const [tokensPriceHistory, setTokensPriceHistory] = useState<
    TokenPriceHistory[]
  >([]);
  const [tokenPriceLastUpdated, setTokenPriceLastUpdated] = useState<
    number | null
  >(null);
  const [tokenPriceHistoryLastUpdated, setTokenPriceHistoryLastUpdated] =
    useState<number>(0);

  const [footerDataToDisplay, setFooterDataToDisplay] =
    useState<string>("Steps");

  const [positions, setPositions] = useState<Position[]>([]);
  const [triggerRefetchUserData, setTriggerRefetchUserData] =
    useState<boolean>(false);

  const [resultingPoints, setResultingPoints] = useState<number | null>(null);

  useEffect(() => {
    resetUserData();
  }, [publicKey]);

  const fetchNFTpoints = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getNFTPoints`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseJson = await response.json();
      if (responseJson.data instanceof Array && responseJson.data.length > 0)
        setNFTPointsData(responseJson.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!poolServerId || !publicKey) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/isAllowedToPlay?pubkey=${publicKey.toBase58()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseJson = await response.json();
        const isAllowedToPlay = Boolean(responseJson.data);

        setIsAllowedToPlay(isAllowedToPlay);

        const responsePoints = await fetch(
          `${API_BASE_URL}/poolPoints?pubkey=${publicKey.toBase58()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responsePointsJson = await responsePoints.json();

        setPointsRemaining(responsePointsJson.data);

        const fetchedPositions = await Position.fetchMultiplePositions(
          publicKey.toBase58()
        );
        setPositions(fetchedPositions);
      } catch (e) {
        console.error(e);
      }
    };

    if (
      poolServerId &&
      connected &&
      publicKey &&
      wallet.signAllTransactions &&
      wallet.signTransaction
    ) {
      const uiWallet: UIWallet = {
        publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      };
      setSdk(
        new SDK(connection, uiWallet, { preflightCommitment: "confirmed" })
      );
    }
    fetchData();
  }, [
    connected,
    publicKey,
    wallet.signAllTransactions,
    wallet.signTransaction,
    poolServerId,
    triggerRefetchUserData,
  ]);

  const resetUserData = () => {
    setPointsRemaining(null);
    setIsAllowedToPlay(null);
    setResultingPoints(null);
  };

  const fetchTokenPrices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getBirdeyeTokenPrices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();
      const fetchedTokensPrices: BirdeyeTokenPriceData[] = responseJson.data;
      if (fetchedTokensPrices?.length > 0) {
        setFetchedTokensPrices(true);
        setTokensPrices(fetchedTokensPrices);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTokenPricesLastUpdated = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/getBirdeyeTokenPriceLastUpdated`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();

      const lastUpdatedTs = responseJson.data.lastUpdatedTs;

      if (lastUpdatedTs) setTokenPriceLastUpdated(lastUpdatedTs * 1000);
      else setTokenPriceLastUpdated(Date.now() + 5 * 60 * 1000);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!tokenPriceLastUpdated) return;
      const timeNow = Date.now();

      if (timeNow >= getTokenPriceExpiryTimeStamp(tokenPriceLastUpdated)) {
        if (
          timeNow - getTokenPriceExpiryTimeStamp(tokenPriceLastUpdated) >
          5 * 60 * 1000
        )
          return;
        fetchTokenPrices();
        fetchTokenPricesLastUpdated();
      }
    }, 1000 * 60);

    return () => {
      clearInterval(id);
    };
  }, [tokenPriceLastUpdated]);

  useEffect(() => {
    const fetchPoolServerId = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/poolServerId`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseJson = await response.json();

        setPoolServerId(responseJson.poolServerId);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchTotalGamesPlayed = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/poolGamesPlayed`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseJson = await response.json();

        setGamesPlayed(responseJson.data);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchChartsData = async () => {
      if (tokensPriceHistory.length > 0) return;
      try {
        const data = await Promise.all(
          PROJECTS_TO_PLAY.map((project) =>
            fetchTokenChartData(project.mint, tokenPriceHistoryLastUpdated)
          )
        );

        if (data) {
          setTokensPriceHistory(data);
          setFetchedChartsData(true);
          setTokenPriceHistoryLastUpdated(Math.floor(Date.now() / 1000));
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (!poolServerId) fetchPoolServerId();
    if (gamesPlayed === null) fetchTotalGamesPlayed();

    if (!fetchedChartsData && tokensPriceHistory.length === 0)
      fetchChartsData();
    if (nftPointsData.length === 0) fetchNFTpoints();

    if (tokensPrices.length === 0) fetchTokenPrices();
    if (!tokenPriceLastUpdated) fetchTokenPricesLastUpdated();

    const id = setInterval(() => {
      fetchNFTpoints();
    }, 1000 * 60 * 5);

    return () => {
      clearInterval(id);
    };
  }, []);

  const updatePoolConfig = async () => {
    if (!sdk) return;
    try {
      setIsFetchingPoolConfig(true);
      const newPoolConfigAccount = await fetchPoolConfigFromAPI();
      if (!newPoolConfigAccount) return;
      const newPoolConfigInstance = PoolConfig.fromPoolConfigAccount(
        newPoolConfigAccount,
        sdk
      );

      setPoolConfig(newPoolConfigInstance);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingPoolConfig(false);
    }
  };

  useEffect(() => {
    const fetchPoolConfig = async () => {
      if (!sdk) return;
      try {
        setIsFetchingPoolConfig(true);
        const poolConfig = await PoolConfig.fetch(
          sdk,
          new solana.PublicKey(MAINNET_POOL_CONFIG_PUBKEY)
        );
        setPoolConfig(poolConfig);
      } catch (e) {
        console.error(e);
      } finally {
        setIsFetchingPoolConfig(false);
      }
    };
    if (sdk) fetchPoolConfig();

    if (sdk) {
      sdk.connection.onAccountChange(
        new solana.PublicKey(MAINNET_POOL_CONFIG_PUBKEY),
        async () => {
          toast.loading("Updating state", {
            id: "update-pool-config",
          });

          setTimeout(async () => {
            const newPoolConfigAccount: PoolConfigAccount | null =
              await fetchPoolConfigFromAPI();

            if (!newPoolConfigAccount) return;
            const newPoolConfigInstance = PoolConfig.fromPoolConfigAccount(
              newPoolConfigAccount,
              sdk
            );
            setPoolConfig(newPoolConfigInstance);
            toast.success("State updated", {
              id: "update-pool-config",
            });
          }, 2000);
        }
      );
    }
  }, [sdk]);

  useEffect(() => {
    if (positions.length === 0 || tokensPrices.length === 0) return;

    const calulatedPoints = calculateResultingPoints(positions, tokensPrices);
    setResultingPoints(calulatedPoints);
  }, [positions, tokensPrices]);

  return (
    <AppContext.Provider
      value={{
        connection,
        sdk,
        poolConfig,
        isFetchingPoolConfig,
        setSdk,
        setPoolConfig,
        poolServerId,
        setPoolServerId,
        isAllowedToPlay,
        setIsAllowedToPlay,
        pointsRemaining,
        setPointsRemaining,
        positions,
        setPositions,
        tokensPrices,
        setTokensPrices,
        tokensPriceHistory,
        setTokensPriceHistory,
        triggerRefetchUserData,
        setTriggerRefetchUserData,
        fetchedTokensPrices,
        setFetchedTokensPrices,
        tokenPriceLastUpdated,
        setTokenPriceLastUpdated,
        footerModalOpen,
        setFooterModalOpen,
        footerDataToDisplay,
        setFooterDataToDisplay,
        resultingPoints,
        setResultingPoints,
        updatePoolConfig,
        resetUserData,
        gamesPlayed,
        tokensMetadata,
        nftPointsData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
