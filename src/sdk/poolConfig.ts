import { PublicKey } from "@solana/web3.js";
import type { PoolState } from "./types";
import type { RawPoolConfig, SDK } from "./sdk";
import * as solana from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import { API_BASE_URL } from "@/utils/constants";
import { PoolConfigAccount } from "@/utils/types";
import { fromRawConfigPoolDataToHumanReadableData } from "@/utils/helpers";

export class PoolConfig {
  private sdk: SDK;
  public poolState: PoolState;
  public poolAddress: PublicKey;
  public poolAuthority: PublicKey;
  public poolActiveMint: PublicKey;
  public poolDepositPerUser: number;
  public poolRoundWinAllocation: number;
  public squadsAuthorityPubkey: PublicKey;
  public poolBalance: number;
  public poolDepositsPaused: boolean;

  constructor({
    _sdk,
    humanReadableData,
  }: {
    _sdk: SDK;
    humanReadableData: PoolConfigAccount;
  }) {
    this.sdk = _sdk;

    this.poolState = humanReadableData.poolState;
    this.poolAddress = new PublicKey(humanReadableData.poolAddress);
    this.poolAuthority = new PublicKey(humanReadableData.poolAuthority);
    this.poolActiveMint = new PublicKey(humanReadableData.poolActiveMint);
    this.poolDepositPerUser = humanReadableData.poolDepositPerUser;
    this.poolRoundWinAllocation = humanReadableData.poolRoundWinAllocation;
    this.squadsAuthorityPubkey = new PublicKey(
      humanReadableData.squadsAuthorityPubkey
    );
    this.poolBalance = humanReadableData.poolBalance;
    this.poolDepositsPaused = humanReadableData.poolDepositsPaused;
  }

  static fromPoolConfigAccount(
    poolConfigAccountData: PoolConfigAccount,
    sdk: SDK
  ): PoolConfig {
    return new PoolConfig({
      _sdk: sdk,
      humanReadableData: poolConfigAccountData,
    });
  }

  async deposit(): Promise<PoolConfig> {
    const poolTokenAccount = await spl.getAssociatedTokenAddress(
      this.poolActiveMint,
      this.poolAuthority
    );

    const depositorTokenAccount = await spl.getAssociatedTokenAddress(
      this.poolActiveMint,
      this.sdk.wallet.publicKey
    );

    await this.sdk.program.methods
      .deposit()
      .accountsStrict({
        poolConfig: this.poolAddress,
        depositor: this.sdk.wallet.publicKey,
        mint: this.poolActiveMint,
        poolTokenAccount: poolTokenAccount,
        depositorTokenAccount: depositorTokenAccount,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      })
      .rpc();

    const response = await fetch(`${API_BASE_URL}/poolDeposit`, {
      method: "POST",
      body: JSON.stringify({
        pubkey: this.sdk.wallet.publicKey.toBase58(),
      }),
    });

    const responseJson = await response.json();

    if (response.status !== 200) {
      throw new Error(responseJson.error);
    }

    return this.reload();
  }

  async reload(): Promise<PoolConfig> {
    return PoolConfig.fetch(this.sdk, this.poolAddress);
  }

  static async fetch(sdk: SDK, address: PublicKey): Promise<PoolConfig> {
    const poolConfigAcc = await sdk.program.account.poolConfig.fetch(address);
    const humanReadableData =
      fromRawConfigPoolDataToHumanReadableData(poolConfigAcc);
    return new PoolConfig({
      _sdk: sdk,
      humanReadableData,
    });
  }

  async pausePool(): Promise<PoolConfig> {
    await this.sdk.program.methods
      .pausePoolState()
      .accountsStrict({
        poolAuthority: this.poolAuthority,
        poolConfig: this.poolAddress,
      })
      .rpc();

    return this.reload();
  }

  static async initializePoolConfig(
    sdk: SDK,
    squadsPubkey: PublicKey,
    poolDepositPerUser: number,
    poolRoundWinAllocation: number,
    poolAuthority: PublicKey,
    poolConfig: solana.Keypair,
    poolActiveMint: PublicKey
  ): Promise<PoolConfig> {
    await sdk.program.methods
      .initializeConfig(
        poolDepositPerUser,
        poolRoundWinAllocation,
        squadsPubkey
      )
      .accountsStrict({
        poolAuthority,
        poolConfig: poolConfig.publicKey,
        activeMint: poolActiveMint,
        systemProgram: solana.SystemProgram.programId,
      })
      .signers([poolConfig])
      .rpc();

    return PoolConfig.fetch(sdk, poolConfig.publicKey);
  }

  async activatePool(): Promise<PoolConfig> {
    await this.sdk.program.methods
      .activatePoolState()
      .accountsStrict({
        poolAuthority: this.poolAuthority,
        poolConfig: this.poolAddress,
      })
      .rpc();

    return this.reload();
  }

  async changeMint(newMint: PublicKey): Promise<PoolConfig> {
    await this.sdk.program.methods
      .changeMint()
      .accountsStrict({
        poolAuthority: this.poolAuthority,
        poolConfig: this.poolAddress,
        mint: newMint,
      })
      .rpc();

    return this.reload();
  }

  async pauseDeposits(): Promise<PoolConfig> {
    await this.sdk.program.methods
      .pauseDeposits()
      .accountsStrict({
        poolAuthority: this.poolAuthority,
        poolConfig: this.poolAddress,
      })
      .rpc();

    return this.reload();
  }
  async activateDeposits(): Promise<PoolConfig> {
    await this.sdk.program.methods
      .resumeDeposits()
      .accountsStrict({
        poolAuthority: this.poolAuthority,
        poolConfig: this.poolAddress,
      })
      .rpc();

    return this.reload();
  }
}
