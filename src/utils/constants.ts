import { PublicKey } from "@solana/web3.js";

export const HELIUS_RPC_ENDPOINT =
  "https://devnet.helius-rpc.com/?api-key=17f7af93-4fe5-409c-b871-6a01323f3760";

export const CHARCOAL = "#36454F";

export const MAX_ACCESS_FEE = 100;
export const MAX_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export const MAX_RESEARCH_PAPER_SIZE_IN_BYTES = 100 * 1024 * 1024;
export const MAX_IMAGE_SIZE_IN_BYTES = 10 * 1024 * 1024;

export const DEVNET_POOL_CONFIG_PUBKEY =
  "3ZsiWpKCoADMkz9w72A78Z6c6NnAoqwyDyQk1puMXPHe";
export const POOL_AUTH_PUBKEY = new PublicKey(
  "CNiF4Y8VdsA7aMftkF6kumEBz67AsCAyvnZDr6zopYSC"
);

export const PROJECTS_TO_PLAY = [
  "BONK",
  "WIF",
  "POPCAT",
  "MEW",
  "WEN",
  "GIGA",
  "CWIF",
  "BOME",
];

export const GREY_TEXT = "#AEB9B8";
