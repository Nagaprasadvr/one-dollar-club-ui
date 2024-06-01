import { LeaderBoardDataType } from "@/utils/types";
import { Keypair } from "@solana/web3.js";

const keypairTouse = Keypair.generate().publicKey.toBase58();

const solanaMemeTokens = [
  "SAMO",
  "COPE",
  "WOOP",
  "CHEEMS",
  "SOLAPE",
  "KITTY",
  "PUG",
  "MONGOOSE",
  "BONE",
  "HAMS",
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number): number {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

function getRandomPubKey(): string {
  return keypairTouse;
}

function getRandomTop3Positions(): string {
  const shuffled = solanaMemeTokens.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).join(", ");
}

export function generateDummyData(): LeaderBoardDataType[] {
  const dummyData: LeaderBoardDataType[] = [];

  for (let i = 0; i < 20; i++) {
    dummyData.push({
      id: i,
      pubkey: getRandomPubKey(),
      totalPoints: getRandomInt(0, 100),
      rank: i + 1,
      topGainer: getRandomTop3Positions().split(", ")[0],
      totalPositions: getRandomInt(10, 100),
      totalWins: getRandomInt(0, 10),
      totalLosses: getRandomInt(0, 10),
      avgLeverage: getRandomFloat(1, 100, 0),
      top3Positions: getRandomTop3Positions(),
    });
  }

  return dummyData;
}
