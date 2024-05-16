import {
  API_BASE_URL,
  DEVNET_POOL_CONFIG_PUBKEY,
  HELIUS_RPC_ENDPOINT,
} from "@/utils/constants";
import { Connection } from "@solana/web3.js";
import { createContext, useEffect, useMemo, useState } from "react";

import * as solana from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PoolConfig } from "@/sdk/poolConfig";
import { SDK, UIWallet } from "@/sdk/sdk";
import { Position } from "@/sdk/Position";

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
  setPointsRemaining: (pointsRemaining: number) => void;
  positions: Position[];
  setPositions: (positions: Position[]) => void;
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
});

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

  const [poolConfig, setPoolConfig] = useState<PoolConfig | null>(null);
  const [sdk, setSdk] = useState<SDK | null>(null);
  const [poolServerId, setPoolServerId] = useState<string | null>(null);
  const wallet = useWallet();
  const [pointsRemaining, setPointsRemaining] = useState<number | null>(null);

  const [positions, setPositions] = useState<Position[]>([]);
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
    fetchPoolServerId();
  }, []);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
