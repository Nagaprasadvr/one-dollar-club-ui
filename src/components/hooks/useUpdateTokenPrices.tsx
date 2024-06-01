import { useContext, useEffect } from "react";
import { API_URL, AppContext } from "../Context/AppContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { PROJECTS_TO_PLAY } from "@/utils/constants";
import { BirdeyeTokenPriceData } from "@/utils/types";

export const useUpdateTokenPrices = () => {
  const {
    setTokensPrices,
    tokenPriceLastUpdated,
    setFetchedTokensPrices,
    setTokenPriceLastUpdated,
  } = useContext(AppContext);
  const { connected } = useWallet();

  useEffect(() => {
    if (!connected) return;
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
    const tokenPricesFetchInterval = setInterval(() => {
      // fetch token prices
      //   if (Math.round(Date.now() / 1000) - tokenPriceLastUpdated < 60) return;
      fetchTokenPrices();
    }, 1000 * 60);

    return () => {
      clearInterval(tokenPricesFetchInterval);
    };
  }, [connected, setTokensPrices]);
};
