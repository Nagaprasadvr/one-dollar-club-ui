import {
  GridRenderCellParams,
  GridTreeNodeWithRender,
  GridApi,
  GridKeyValue,
} from "@mui/x-data-grid";
import { type Position } from "@/sdk/Position";

import axios from "axios";

import {
  BirdeyeTokenPriceData,
  EstimatedPriorityFee,
  PoolConfigAccount,
  TokenPriceHistory,
} from "./types";
import { API_URL } from "@/components/Context/AppContext";
import {
  API_BASE_URL,
  DEFAULT_COMPUTE_UNIT_LIMIT,
  DEFAULT_COMPUTE_UNIT_PRICE_ML,
  DEFAULT_COMPUTE_UNITS_OFFSET,
  PROJECTS_TO_PLAY,
} from "./constants";
import { RawPoolConfig, SDK, UIWallet } from "@/sdk/sdk";
import { PoolConfig } from "@/sdk/poolConfig";
import * as solana from "@solana/web3.js";

export const minimizePubkey = (pubkey: string) => {
  return pubkey.slice(0, 5) + "..." + pubkey.slice(-5);
};

export const getRow = (
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>
) => {
  const api = params.api as GridApi;
  const thisRow: Record<string, GridKeyValue> = {};

  api
    .getAllColumns()
    .filter((c) => c.field !== "__check__" && !!c)
    .forEach(
      (c) => (thisRow[c.field] = params.api.getCellValue(params.id, c.field))
    );
  return thisRow;
};

export const toUIAmount = (amount: number, decimals: number = 9) => {
  return amount.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
  });
};

export const reduceSignature = (sig: string) => {
  return sig.slice(0, 6) + "..." + sig.slice(sig.length - 6);
};

export const getTotalNumberOfDaysInAMonth = (month: number, year: number) => {
  switch (month) {
    case 0:
      return 31;
    case 1:
      return year % 4 === 0 ? 29 : 28;
    case 2:
      return 31;
    case 3:
      return 30;
    case 4:
      return 31;
    case 5:
      return 30;
    case 6:
      return 31;
    case 7:
      return 31;
    case 8:
      return 30;
    case 9:
      return 31;
    case 10:
      return 30;
    case 11:
      return 31;
    default:
      return 0;
  }
};

export const getExpiry = () => {
  const now = new Date();
  let expiryTime = new Date(now);

  expiryTime.setUTCHours(23, 0, 0, 0);

  if (now >= expiryTime) {
    // If the current time is past today's 23:00:00 UTC, set expiry to tomorrow
    expiryTime.setUTCDate(expiryTime.getUTCDate() + 1);
  }

  return expiryTime;
};

interface PriceHistoryChartData {
  name: string;
  data: BirdeyeTokenPriceData[];
}

export const safeDivide = (a: number, b: number) => {
  if (b === 0) return 0;
  return a / b;
};

export const fetchTokenChartData = async (
  tokenAddress: string,
  lastUpdated: number
): Promise<TokenPriceHistory> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        requestType: "fetchChartData",
        lastUpdated,
        tokenAddress,
      }),
    });
    if (response.status !== 200) {
      return { address: tokenAddress, data: [] };
    }
    const responseJson = await response.json();
    return { address: tokenAddress, data: responseJson.data };
  } catch (e) {
    console.error(e);
    return {
      address: tokenAddress,
      data: [],
    };
  }
};

// export const get24Change = (_24Change: number) => {
//   if (_24Change > 0) {
//     return (
//       "+" +
//       _24Change.toLocaleString("en-US", {
//         maximumFractionDigits: 4,
//       }) +
//       "%"
//     );
//   }
//   return (
//     _24Change.toLocaleString("en-US", {
//       maximumFractionDigits: 4,
//     }) + "%"
//   );
// };

type PositionResult = {
  entryPrice: number;
  leverage: number;
  currentPrice: number;
  liquidationPrice: number;
  pointsAllocated: number;
  positionType: string;
};

export const calculateResult = (result: PositionResult) => {
  const {
    entryPrice,
    leverage,
    currentPrice,
    pointsAllocated,
    positionType,
    liquidationPrice,
  } = result;

  switch (positionType) {
    case "long":
      if (currentPrice < liquidationPrice) {
        return 0;
      }
      break;
    case "short":
      if (currentPrice > liquidationPrice) {
        return 0;
      }
      break;
  }
  const pointsPerEntryPrice = safeDivide(pointsAllocated, entryPrice);

  const mulCurrentPrice = pointsPerEntryPrice * currentPrice;

  let resultingDiff = 0;
  switch (positionType) {
    case "long":
      resultingDiff = mulCurrentPrice - pointsAllocated;
      break;
    case "short":
      resultingDiff = pointsAllocated - mulCurrentPrice;
      break;
  }

  const withLeverage = resultingDiff * leverage;

  const finalResult = withLeverage + pointsAllocated;

  if (finalResult < 0) {
    return 0;
  }
  return finalResult;
};

export const getLiquidationPrice = ({
  positionType,
  entryPrice,
  leverage,
}: {
  positionType: "long" | "short";
  entryPrice: number;
  leverage: number;
}) => {
  switch (positionType) {
    case "long":
      return entryPrice - safeDivide(entryPrice, leverage);
    case "short":
      return entryPrice + safeDivide(entryPrice, leverage);
  }
};

export const fetchLeaderBoards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderBoard`);

    if (response.data.data instanceof Array) {
      return response.data.data;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchLeaderBoardHistory = async (
  date?: string,
  poolId?: string
) => {
  const queryparams = new URLSearchParams({});
  if (date) queryparams.append("date", date);
  if (poolId) queryparams.append("poolId", poolId);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getLeaderBoardHistory?${queryparams.toString()}`
    );

    if (response.data.data instanceof Array) {
      return response.data.data;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const fetchLeaderBoardLastUpdated = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getLeaderBoardLastUpdated`
    );

    if (response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const fetchPoolConfigFromAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/poolConfig`);
    if (!response.data.poolConfig) return null;
    return response.data.poolConfig;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const fromRawConfigPoolDataToHumanReadableData = (
  rawConfig: RawPoolConfig
): PoolConfigAccount => {
  return {
    poolActiveMint: rawConfig.poolActiveMint.toBase58(),
    poolAddress: rawConfig.poolAddress.toBase58(),
    poolAuthority: rawConfig.poolAuthority.toBase58(),
    poolState: rawConfig.poolState.active ? "Active" : "Inactive",
    poolDepositsPaused: rawConfig.poolDepositsPaused,
    poolBalance: rawConfig.poolBalance,
    poolDepositPerUser: Number(rawConfig.poolDepositPerUser),
    poolRoundWinAllocation: rawConfig.poolRoundWinAllocation,
    squadsAuthorityPubkey: rawConfig.squadsAuthorityPubkey.toBase58(),
  };
};

export const calculateResultingPoints = (
  positions: Position[],
  tokensData: BirdeyeTokenPriceData[]
) => {
  let totalPoints = 0;
  positions.forEach((position) => {
    const tokenData = tokensData.find(
      (token) => token.address === position.tokenMint
    );
    if (!tokenData) return 0;
    const result = calculateResult({
      entryPrice: position.entryPrice,
      leverage: position.leverage,
      currentPrice: tokenData.value,
      liquidationPrice: getLiquidationPrice({
        entryPrice: position.entryPrice,
        leverage: position.leverage,
        positionType: position.positionType,
      }),
      pointsAllocated: position.pointsAllocated,
      positionType: position.positionType,
    });
    totalPoints += result;
  });
  return totalPoints;
};

export const calculateTop3Positions = (
  positions: Position[],
  tokensData: BirdeyeTokenPriceData[]
) => {
  const positionsWithResult: {
    tokenName: string;
    result: number;
  }[] = [];

  positions.forEach((position) => {
    const tokenData = tokensData.find(
      (token) => token.address === position.tokenMint
    );
    if (!tokenData) return "";
    const result = calculateResult({
      entryPrice: position.entryPrice,
      leverage: position.leverage,
      currentPrice: tokenData.value,
      liquidationPrice: getLiquidationPrice({
        entryPrice: position.entryPrice,
        leverage: position.leverage,
        positionType: position.positionType,
      }),
      pointsAllocated: position.pointsAllocated,
      positionType: position.positionType,
    });
    positionsWithResult.push({
      tokenName: position.tokenName,
      result,
    });
  });
  const top3 = positionsWithResult
    .sort((a, b) => b.result - a.result)
    .slice(0, 3)
    .map((position) => position.tokenName)
    .join(", ");

  return top3;
};

export const getTotalPoints = (positions: Position[]) => {
  return positions.reduce((acc, position) => acc + position.pointsAllocated, 0);
};

export const getTokenSymbolFromMint = (poolConfig: PoolConfig) => {
  try {
    if (!poolConfig) return "dBONK";
    const mint = poolConfig?.poolActiveMint?.toBase58();
    const symbol = PROJECTS_TO_PLAY.find((project) => project.mint === mint);
    if (symbol) return symbol.name;
    return "dBONK";
  } catch (e) {
    return "dBONK";
  }
};

export const getLeaderBoardExpiryTimeStamp = (lastUpdated: number) => {
  const lastUpdatedTime = new Date(lastUpdated).getTime() + 5 * 60 * 1000;

  return lastUpdatedTime;
};

export const getTokenPriceExpiryTimeStamp = (lastUpdated: number) => {
  const lastUpdatedTime = new Date(lastUpdated).getTime() + 5 * 60 * 1000;

  return lastUpdatedTime;
};

export const addDecimals = (value: number, decimals: number) => {
  return value * 10 ** decimals;
};

export const removeDecimals = (value: number, decimals: number) => {
  return value / 10 ** decimals;
};

export const getEstimatedPriorityFee = async (
  sdk: SDK
): Promise<EstimatedPriorityFee> => {
  try {
    const recentPriorityFeeData =
      await sdk.connection.getRecentPrioritizationFees();

    if (recentPriorityFeeData.length === 0) {
      return null;
    }
    let avgPriorityFee = recentPriorityFeeData.reduce(
      (acc, { prioritizationFee }) => acc + prioritizationFee,
      0
    );
    avgPriorityFee /= recentPriorityFeeData.length;
    avgPriorityFee = Math.ceil(avgPriorityFee);

    return {
      microLamports: avgPriorityFee,
    };
  } catch (error) {
    return null;
  }
};

export const getComputeUnitsToBeConsumed = async (
  tx: solana.Transaction,
  connection: solana.Connection
) => {
  try {
    const latestBlockhash = await connection.getLatestBlockhash();
    const ixs = tx.instructions;
    if (!tx.feePayer) {
      return null;
    }
    const txMessage = new solana.TransactionMessage({
      payerKey: tx.feePayer,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: ixs,
    }).compileToV0Message();

    const versionedTx = new solana.VersionedTransaction(txMessage);
    const simulateTxResult = await connection.simulateTransaction(versionedTx, {
      sigVerify: false,
    });
    const unitsConsumed = simulateTxResult.value?.unitsConsumed;
    if (!unitsConsumed) {
      throw new Error("Failed to get units consumed");
    }
    return unitsConsumed + DEFAULT_COMPUTE_UNITS_OFFSET;
  } catch (error) {
    return null;
  }
};

export async function expirationRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  if (maxRetries === 0) return await fn();
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (!isTransactionExpiredBlockheightExceededError(error)) throw error;
      retryCount++;
      console.error(`Attempt ${retryCount + 1} tx expired. Retrying...`);
    }
  }
  throw new Error("Max Tx Expiration retries exceeded");
}

function isTransactionExpiredBlockheightExceededError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("TransactionExpiredBlockheightExceededError")
  );
}

export const sendAndConTxWithComputePriceAndRetry = async (
  ix: solana.TransactionInstruction,
  sdk: SDK,
  retries = 5
) => {
  const fn = async () => {
    const latestBlockHash = await sdk.connection.getLatestBlockhash();

    // let computeUnitsNeeded = await getComputeUnitsToBeConsumed(
    //   tx,
    //   sdk.connection
    // );

    // if (!computeUnitsNeeded) {
    //   computeUnitsNeeded = DEFAULT_COMPUTE_UNIT_LIMIT;
    // }

    // let estimatedPriorityFee = await getEstimatedPriorityFee(sdk);
    // if (!estimatedPriorityFee) {
    //   estimatedPriorityFee = {
    //     microLamports: DEFAULT_COMPUTE_UNIT_PRICE_ML,
    //   };
    // }
    const estimatedPriorityFee = {
      microLamports: DEFAULT_COMPUTE_UNIT_PRICE_ML,
    };

    const computeUnitPriceIx = solana.ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: estimatedPriorityFee.microLamports,
    });
    // const computeUnitsLimitIx = solana.ComputeBudgetProgram.setComputeUnitLimit(
    //   {
    //     units: computeUnitsNeeded,
    //   }
    // );
    // tx.add(computeUnitsLimitIx);

    const txMessage = new solana.TransactionMessage({
      payerKey: sdk.wallet.publicKey,
      recentBlockhash: latestBlockHash.blockhash,
      instructions: [computeUnitPriceIx, ix],
    }).compileToV0Message();

    const versionedTx = new solana.VersionedTransaction(txMessage);

    const signedTx = await sdk.wallet.signTransaction(versionedTx);

    const sig = await sdk.connection.sendTransaction(signedTx);

    await sdk.connection.confirmTransaction({
      signature: sig,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      blockhash: latestBlockHash.blockhash,
    });

    return sig;
  };
  try {
    return await expirationRetry(fn, retries);
  } catch (e) {
    console.error(e);
    return null;
  }
};
