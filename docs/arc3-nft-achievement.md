# ARC-3 Achievement NFT — Technical Documentation

## Overview

When a user completes a savings goal on AlgoSave, they can mint a **unique, non-fungible token** (NFT) on the Algorand Testnet as permanent on-chain proof of their achievement.  
The NFT is created as an **Algorand Standard Asset (ASA)** that follows the **[ARC-3 metadata standard](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0003.md)**.

---

## What is ARC-3?

**ARC-3** is the Algorand Request for Comments #3 — the standard for Algorand NFT metadata.  
It specifies how metadata (name, description, image, properties) should be attached to an ASA so that wallets, marketplaces, and block explorers can display it consistently.

Key ARC-3 rules implemented in AlgoSave:
- **Total supply = 1** — makes the asset truly non-fungible.
- **Decimals = 0** — no fractional tokens.
- **Asset URL ends with `#arc3`** — signals to wallets that this ASA follows the ARC-3 standard.
- **JSON metadata in the transaction note** — carries the goal achievement data permanently on-chain.

---

## NFT Minting Flow

```
1. User completes savings goal (goal_completed == 1 in smart contract)
2. "Mint Achievement NFT" button appears in the goal details page
3. User clicks the button → wallet approval dialog opens
4. Frontend calls mintAchievementNFT() in src/lib/blockchain.ts
5. A single ASA-creation transaction is built and signed
6. Transaction is submitted to Algorand Testnet
7. ASA ID is returned and stored in localStorage
8. AlgoExplorer link is shown to the user
```

---

## ARC-3 Metadata Structure

The following JSON is embedded in the **transaction note** field of the ASA creation transaction:

```json
{
  "standard": "arc3",
  "name": "DhanSathi Achievement: <goalName>",
  "description": "Goal \"<goalName>\" completed on DhanSathi AlgoSave",
  "properties": {
    "goalName": "<goalName>",
    "targetAmount": 5000000,
    "totalSaved": 5000000,
    "appId": 755771019,
    "completedAt": "2025-02-19T10:30:00.000Z"
  }
}
```

---

## ASA Parameters

| Parameter     | Value                                                      | ARC-3 Significance                        |
|---------------|------------------------------------------------------------|-------------------------------------------|
| `assetName`   | `DSAchv-<goalName>` (max 32 bytes)                         | Human-readable identifier                 |
| `unitName`    | `DSACHV`                                                   | Short ticker symbol                       |
| `total`       | `1`                                                        | Non-fungible (exactly one exists)         |
| `decimals`    | `0`                                                        | Indivisible token                         |
| `assetURL`    | `https://testnet.explorer.perawallet.app/application/<appId>#arc3` | ARC-3 marker + links to savings vault |
| `defaultFrozen` | `false`                                                  | Token is transferable                     |
| `manager`     | Owner's wallet address                                     | Can update ASA metadata                   |
| `reserve`     | Owner's wallet address                                     | Holds uncirculated supply                 |
| `freeze`      | Owner's wallet address                                     | Can freeze transfers if needed            |
| `clawback`    | Owner's wallet address                                     | Can reclaim token if needed               |

---

## Code Reference

**File:** `src/lib/blockchain.ts`  
**Function:** `mintAchievementNFT(senderAddress, goalInfo, signTransactions)`

```typescript
export async function mintAchievementNFT(
    senderAddress: string,
    goalInfo: {
        goalName: string;
        targetAmount: number; // microALGOs
        totalSaved: number;   // microALGOs
        appId: number;
    },
    signTransactions: (txns: Transaction[]) => Promise<Uint8Array[]>
): Promise<MintNFTResult>
```

**Returns:**
```typescript
export interface MintNFTResult {
    asaId: number;   // Algorand Standard Asset ID
    txId: string;    // Creation transaction ID
}
```

**UI Component:** `src/components/goals/GoalDetailsClient.tsx` — `handleMintNFT()` and the "ARC-3 Achievement NFT" card.

---

## Viewing the NFT on Testnet

Once minted, the achievement NFT can be viewed on:

- **Pera Explorer (ASA):** `https://testnet.explorer.perawallet.app/asset/<asaId>`
- **Pera Explorer (Mint Tx):** `https://testnet.explorer.perawallet.app/tx/<txId>`
- **Lora AlgoKit Explorer:** `https://lora.algokit.io/testnet/asset/<asaId>`

The goal details page shows clickable links to both after minting.

---

## Local Storage Record

After minting, the NFT record is saved to `localStorage` under the key `algosave_nfts` so the user doesn't have to re-query the blockchain on every visit.

```typescript
export interface AchievementNFT {
  asaId: number;      // Algorand Standard Asset ID
  txId: string;       // creation transaction ID
  goalId: string;     // local goal identifier
  goalName: string;
  targetAmount: number; // microALGOs
  totalSaved: number;   // microALGOs
  appId: number;
  mintedAt: string;   // ISO timestamp
}
```

---

## Why NFTs for Achievements?

| Benefit                   | Explanation                                                             |
|---------------------------|-------------------------------------------------------------------------|
| **Immutability**          | The on-chain record cannot be altered or deleted                        |
| **Verifiability**         | Anyone can verify the achievement using the block explorer              |
| **Ownership**             | The NFT lives in the user's own Algorand wallet                         |
| **Portfolio proof**       | Demonstrates real financial discipline through blockchain evidence      |
| **Low cost**              | Creating an ASA on Algorand Testnet costs < 0.002 ALGO                  |
