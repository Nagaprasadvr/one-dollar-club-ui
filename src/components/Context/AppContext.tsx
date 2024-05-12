import {
  DEVNET_POOL_CONFIG_PUBKEY,
  HELIUS_RPC_ENDPOINT,
} from "@/utils/constants";
import { Connection } from "@solana/web3.js";
import { createContext, useEffect, useMemo, useState } from "react";

import * as solana from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PoolConfig } from "@/sdk/poolConfig";
import { SDK, UIWallet } from "@/sdk/sdk";

interface AppContextType {
  connection: Connection;
  poolConfig: PoolConfig | null;
  sdk: SDK | null;
  isFetchingPoolConfig: boolean | null;
  setSdk: (sdk: SDK | null) => void;
  setPoolConfig: (poolConfig: PoolConfig | null) => void;
}

export const AppContext = createContext<AppContextType>({
  connection: new Connection(HELIUS_RPC_ENDPOINT),
  poolConfig: null,
  sdk: null,
  isFetchingPoolConfig: false,
  setSdk: () => {},
  setPoolConfig: () => {},
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
  const connection = useMemo(
    () => new Connection(HELIUS_RPC_ENDPOINT, "confirmed"),
    []
  );

  const [poolConfig, setPoolConfig] = useState<PoolConfig | null>(null);
  const [sdk, setSdk] = useState<SDK | null>(null);
  const wallet = useWallet();

  useEffect(() => {
    if (
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
  }, [
    connected,
    publicKey,
    wallet.signAllTransactions,
    wallet.signTransaction,
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
        console.log("poolConfig", poolConfig);
        setPoolConfig(poolConfig);
      } catch (e) {
        console.log(e);
      } finally {
        setIsFetchingPoolConfig(false);
      }
    };
    if (sdk) fetchPoolConfig();
  }, [sdk]);

  console.log("sdk", sdk);
  return (
    <AppContext.Provider
      value={{
        connection,
        sdk,
        poolConfig,
        isFetchingPoolConfig,
        setSdk,
        setPoolConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
