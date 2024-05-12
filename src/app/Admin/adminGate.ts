import { POOL_AUTH_PUBKEY } from "@/utils/constants";
import { PublicKey } from "@solana/web3.js";

export const adminGate = (wallet: PublicKey) => {
  if (wallet.equals(POOL_AUTH_PUBKEY)) {
    return true;
  }
  return false;
};
