import { PublicKey } from "@solana/web3.js";
import { Project } from "./types";

export const CHARCOAL = "#36454F";

export const MAX_ACCESS_FEE = 100;
export const MAX_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export const MAX_RESEARCH_PAPER_SIZE_IN_BYTES = 100 * 1024 * 1024;
export const MAX_IMAGE_SIZE_IN_BYTES = 10 * 1024 * 1024;

export const PROJECTS_TO_PLAY: Project[] = [
  {
    name: "BONK",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    logoURI:
      "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I?ext=png",
  },
  {
    name: "WIF",
    mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    logoURI:
      "https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link",
  },
  {
    name: "BOME",
    mint: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82",
    logoURI:
      "https://assets.coingecko.com/coins/images/36071/standard/bome.png?1710407255",
  },
  {
    name: "POPCAT",
    mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    logoURI:
      "https://bafkreidvkvuzyslw5jh5z242lgzwzhbi2kxxnpkic5wsvyno5ikvpr7reu.ipfs.nftstorage.link",
  },
  {
    name: "MEW",
    mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
    logoURI:
      "https://bafkreidlwyr565dxtao2ipsze6bmzpszqzybz7sqi2zaet5fs7k53henju.ipfs.nftstorage.link/",
  },
  {
    name: "WEN",
    mint: "WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk",
    logoURI:
      "https://shdw-drive.genesysgo.net/GwJapVHVvfM4Mw4sWszkzywncUWuxxPd6s9VuFfXRgie/wen_logo.png",
  },
  {
    name: "GIGA",
    mint: "63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9",
    logoURI:
      "https://bafybeifiyvpbr3kd6wepax4qxdlxbjrpz2de4lqsuwwuihirvaal6kqwba.ipfs.nftstorage.link",
  },
  {
    name: "CWIF",
    mint: "7atgF8KQo4wJrD5ATGX7t1V2zVvykPJbFfNeVf1icFv1",
    logoURI: "https://i.postimg.cc/d1QD417z/200x200logo-copy.jpg",
  },
  {
    name: "BODEN",
    mint: "3psH1Mj1f7yUfaD5gh6Zj7epE8hhrMkMETgv5TshQA4o",
    logoURI:
      "https://assets.coingecko.com/coins/images/35872/standard/boden.jpeg?1709974700",
  },
  {
    name: "MOTHER",
    mint: "3S8qX1MsMqRbiwKg2cQyx7nis1oHMgaCuc9c4VfvVdPN",
    logoURI:
      "https://cf-ipfs.com/ipfs/QmUFTFWsJiceS99iDMDm2NYuhvHXJVXTgmsDeR28X8njSn",
  },
];

export const GREY_TEXT = "#AEB9B8";

export const API_BASE_URL = "https://server.onedollarclub.fun/";
export const birdeyeUrl = "https://birdeye.so/token/";

export const SOLANA_EXPLORER_URL = "https://explorer.solana.com/address";

export const HELIUS_DEVNET_RPC_ENDPOINT =
  "https://devnet.helius-rpc.com/?api-key=52d3aae3-07be-4900-a393-49d36a260649";

export const HELIUS_MAINNET_RPC_ENDPOINT =
  "https://mainnet.helius-rpc.com/?api-key=52d3aae3-07be-4900-a393-49d36a260649";

export const POOL_AUTH_PUBKEY = new PublicKey(
  "AsM97N16ejpKcVJTwEWtnLsDMz7jFPGr6SU1vzJD9xZt"
);

export const BONK_MAINNET_MINT = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
export const BONK_DEVNET_MINT = "31nhKDV3WudEC8Nfwa8sfPiGq9FEeXknSmDZTSKQiru1";
export const MAINNET_POOL_CONFIG_PUBKEY =
  "4NGsmgPxgdZtw9F6hbZdWFQbFq7zMbGKi3Jt9ZKQqgQA";

export const DEVNET_POOL_CONFIG_PUBKEY =
  "7d9QiPPQ4q9DV4UyLS3j9ZSR71NRwCQ4NMYeHaCkXByz";

export const BONK_DECIMALS = 5;
