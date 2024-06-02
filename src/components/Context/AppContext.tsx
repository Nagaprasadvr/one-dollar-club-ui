import {
  API_BASE_URL,
  DEVNET_POOL_CONFIG_PUBKEY,
  HELIUS_RPC_ENDPOINT,
  PROJECTS_TO_PLAY,
} from "@/utils/constants";
import { Connection } from "@solana/web3.js";
import { createContext, useEffect, useMemo, useState } from "react";

import * as solana from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PoolConfig } from "@/sdk/poolConfig";
import { SDK, UIWallet } from "@/sdk/sdk";
import { Position } from "@/sdk/Position";
import { BirdeyeTokenPriceData, TokenPriceHistory } from "@/utils/types";
import axios from "axios";
import { fetchTokenChartData } from "@/utils/helpers";
import toast from "react-hot-toast";
import { useUpdateTokenPrices } from "../hooks/useUpdateTokenPrices";
interface AppContextType {
  connection: Connection;
  poolConfig: PoolConfig | null;
  sdk: SDK | null;
  isFetchingPoolConfig: boolean | null;
  setSdk: (sdk: SDK | null) => void;
  setPoolConfig: (poolConfig: PoolConfig | null) => void;
  poolServerId: string | null;
  setPoolServerId: (poolServerId: string | null) => void;
  isAllowedToPlay: boolean;
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
  tokenPriceLastUpdated: number;
  setTokenPriceLastUpdated: (tokenPriceLastUpdated: number) => void;
  footerModalOpen: boolean;
  setFooterModalOpen: (footerOpen: boolean) => void;
  footerDataToDisplay: string;
  setFooterDataToDisplay: (footerDataToDisplay: string) => void;
}

export const AppContext = createContext<AppContextType>({
  connection: new Connection(HELIUS_RPC_ENDPOINT),
  poolConfig: null,
  sdk: null,
  isFetchingPoolConfig: false,
  setSdk: () => {},
  setPoolConfig: () => {},
  poolServerId: null,
  setPoolServerId: () => {},
  isAllowedToPlay: false,
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

  const [isAllowedToPlay, setIsAllowedToPlay] = useState<boolean>(false);
  const connection = useMemo(
    () => new Connection(HELIUS_RPC_ENDPOINT, "confirmed"),
    []
  );

  const [footerModalOpen, setFooterModalOpen] = useState<boolean>(true);

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
  const [tokenPriceLastUpdated, setTokenPriceLastUpdated] = useState<number>(0);
  const [tokenPriceHistoryLastUpdated, setTokenPriceHistoryLastUpdated] =
    useState<number>(0);

  const [footerDataToDisplay, setFooterDataToDisplay] =
    useState<string>("Steps");

  const [positions, setPositions] = useState<Position[]>([]);
  const [triggerRefetchUserData, setTriggerRefetchUserData] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!poolServerId || !publicKey) return;
      toast.loading("Fetching user data...", {
        id: "fetchUserData",
      });
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
        toast.success("User data fetched successfully", {
          id: "fetchUserData",
        });
      } catch (e) {
        console.error(e);
        toast.error("Error while fetching user data", {
          id: "fetchUserData",
        });
      }
    };

    if (
      poolServerId &&
      connected &&
      publicKey &&
      wallet.signAllTransactions &&
      wallet.signTransaction &&
      !sdk
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

  useEffect(() => {
    if (!sdk || !connected) return;
    const fetchTokenPrices = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify({
            requestType: "fetchTokensPrice",
            lastUpdated: tokenPriceLastUpdated,
            tokenAddressArray: PROJECTS_TO_PLAY.map((project) => project.mint),
          }),
        });

        if (response.status !== 200) return;

        const responseJson = await response.json();
        const fetchedTokensPrices: BirdeyeTokenPriceData[] = responseJson.data;
        if (fetchedTokensPrices?.length > 0) {
          setFetchedTokensPrices(true);
          setTokenPriceLastUpdated(Math.round(Date.now() / 1000));
          setTokensPrices(fetchedTokensPrices);
        }
      } catch (e) {
        console.error(e);
      }
    };

    // if (tokenPriceHistoryLastUpdated === 0) {
    //   fetchTokenPrices();
    // }
    const tokenPricesFetchInterval = setInterval(() => {
      // fetch token prices
      if (Math.round(Date.now() / 1000) - tokenPriceLastUpdated < 60) return;
      fetchTokenPrices();
    }, 1000 * 60 * 60);

    return () => {
      clearInterval(tokenPricesFetchInterval);
    };
  }, [connected, sdk, setTokensPrices]);

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
    // if (!fetchedChartsData && tokensPriceHistory.length === 0)
    //   fetchChartsData();
  }, [
    fetchedTokensPrices,
    fetchedChartsData,
    tokenPriceHistoryLastUpdated,
    tokenPriceLastUpdated,
  ]);

  useEffect(() => {
    const fetchPoolConfig = async () => {
      if (!sdk) return;
      try {
        setIsFetchingPoolConfig(true);
        const poolConfig = await PoolConfig.fetch(
          sdk,
          new solana.PublicKey(DEVNET_POOL_CONFIG_PUBKEY)
        );
        setPoolConfig(poolConfig);
      } catch (e) {
        console.error(e);
      } finally {
        setIsFetchingPoolConfig(false);
      }
    };
    if (sdk) fetchPoolConfig();
  }, [sdk]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
