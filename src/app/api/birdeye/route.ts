import { BirdeyeTokenPriceData } from "@/utils/types";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";

const birdeyeApiKey = process.env.BIRDEYE_API_KEY;

const BIRDEYE_BASE_URL = "https://public-api.birdeye.so/defi";

const headers = {
  "X-API-KEY": birdeyeApiKey,
};

const responseHeaders = {
  "Cache-Control": "public s-maxage=300",
  "CDN-Cache-Control": "public s-maxage=300",
  "Vercel-CDN-Cache-Control": "public s-maxage=300",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  let response;
  if (!birdeyeApiKey) {
    return NextResponse.json(
      { error: "Birdeye API key is missing" },
      {
        headers: responseHeaders,
        status: 500,
      }
    );
  }
  const { requestType, lastUpdated } = body;
  if (!requestType || lastUpdated === undefined) {
    return NextResponse.json(
      { error: "requestType or lastUpdated is missing" },
      {
        headers: responseHeaders,
        status: 400,
      }
    );
  }
  const timeNow = Math.floor(Date.now() / 1000);
  if (timeNow - lastUpdated < 300) {
    return NextResponse.json(
      { error: "Data is too fresh" },
      {
        headers: responseHeaders,
        status: 200,
      }
    );
  }
  switch (requestType) {
    case "fetchTokensPrice":
      const tokenAddressArray = body.tokenAddressArray;
      if (!tokenAddressArray || tokenAddressArray?.length === 0) {
        return NextResponse.json(
          { error: "tokenNames is required" },
          {
            headers: responseHeaders,
            status: 400,
          }
        );
      }
      const tokenNamesJoined = Array<string>(tokenAddressArray).join("%2C");
      response = await axios.get(
        `${BIRDEYE_BASE_URL}/multi_price?list_address=${tokenNamesJoined}`,
        {
          headers: headers,
        }
      );
      const tokenDataObject = response.data.data;
      const tokensPrices: BirdeyeTokenPriceData[] = Object.keys(
        tokenDataObject
      ).map((tokenAddress) => {
        const tokenData = tokenDataObject[tokenAddress];
        return {
          address: tokenAddress,
          value: tokenData.value,
          updateUnixTime: tokenData.updateUnixTime,
          updateHumanTime: tokenData.updateHumanTime,
          priceChange24h: tokenData.priceChange24h,
        };
      });

      return NextResponse.json(
        {
          data: tokensPrices,
        },
        {
          headers: responseHeaders,
          status: 200,
        }
      );
    case "fetchChartData":
      try {
        const { tokenAddress } = body;
        if (!tokenAddress) {
          return NextResponse.json(
            { error: "tokenAddress is required" },
            {
              headers: responseHeaders,
              status: 400,
            }
          );
        }
        const timeNow = Math.floor(Date.now() / 1000);
        const time24HoursAgo = timeNow - 24 * 60 * 60;
        const queryParams = new URLSearchParams({
          address: tokenAddress,
          address_type: "token",
          type: "30m",
          time_from: time24HoursAgo.toString(),
          time_to: timeNow.toString(),
        });

        response = await axios.get(
          `${BIRDEYE_BASE_URL}/history_price?${queryParams.toString()}`,
          {
            headers: headers,
          }
        );

        const tokenPriceData = response.data.data.items;

        return NextResponse.json(
          {
            data: tokenPriceData,
          },
          {
            headers: responseHeaders,
            status: 200,
          }
        );
      } catch (e) {
        console.error(e);
        return NextResponse.json(
          { error: "Internal server error" },
          {
            headers: responseHeaders,
            status: 500,
          }
        );
      }

    default:
      return NextResponse.json(
        { error: "Invalid requestType" },
        {
          headers: responseHeaders,
          status: 400,
        }
      );
  }
}
