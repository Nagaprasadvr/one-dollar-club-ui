import {
  Box,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  GridRenderCellParams,
  GridTreeNodeWithRender,
  GridApi,
  GridKeyValue,
} from "@mui/x-data-grid";
import toast from "react-hot-toast";

import axios from "axios";

import { BirdeyeTokenPriceData, TokenPriceHistory } from "./types";
import { API_URL } from "@/components/Context/AppContext";
import { API_BASE_URL } from "./constants";

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
  let date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(23, 0, 0, 0);
  return date;
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

export const get24Change = (_24Change: number) => {
  if (_24Change > 0) {
    return (
      "+" +
      _24Change.toLocaleString("en-US", {
        maximumFractionDigits: 4,
      }) +
      "%"
    );
  }
  return (
    _24Change.toLocaleString("en-US", {
      maximumFractionDigits: 4,
    }) + "%"
  );
};

type PositionResult = {
  entryPrice: number;
  leverage: number;
  currentPrice: number;
  liquidationPrice: number;
  pointsAllocated: number;
  positionType: string;
};

export const calculateResult = (result: PositionResult) => {
  const { entryPrice, leverage, currentPrice, pointsAllocated, positionType } =
    result;

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

export const fetchYourStats = async (pubkey: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getPositionsStat?pubkey=${pubkey}`
    );
    if (!response.data.data) return null;
    return response.data.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
