# AlgoExplorer & Algorand Testnet — Documentation

## Overview

All AlgoSave transactions and smart contracts are deployed on the **Algorand Testnet**.  
This document explains how to view on-chain activity using block explorers and how to obtain Testnet ALGO for testing.

---

## Algorand Testnet

| Detail          | Value                                        |
|-----------------|----------------------------------------------|
| **Network Name**| Algorand Testnet                             |
| **Chain ID**    | 416002                                       |
| **Algod API**   | https://testnet-api.algonode.cloud           |
| **Indexer API** | https://testnet-idx.algonode.cloud           |
| **Native Token**| ALGO (TestNet — no real value)               |
| **Block time**  | ~3.3 seconds                                 |
| **Finality**    | ~5 seconds (immediate single-step finality)  |

---

## Block Explorers

AlgoExplorer.io has been **deprecated**. The recommended explorers for Algorand Testnet are:

### 1. Pera Explorer (Primary)

The official explorer maintained by Pera Wallet — used throughout the AlgoSave UI.

| Resource            | URL Pattern                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| Application (App)   | `https://testnet.explorer.perawallet.app/application/<APP_ID>`             |
| Transaction         | `https://testnet.explorer.perawallet.app/tx/<TX_ID>`                       |
| Asset (ASA / NFT)   | `https://testnet.explorer.perawallet.app/asset/<ASA_ID>`                   |
| Account             | `https://testnet.explorer.perawallet.app/address/<WALLET_ADDRESS>`         |

### 2. Lora — AlgoKit Explorer (Secondary)

The explorer built into the AlgoKit developer toolchain, optimised for debugging.

| Resource            | URL Pattern                                                          |
|---------------------|----------------------------------------------------------------------|
| Application (App)   | `https://lora.algokit.io/testnet/application/<APP_ID>`              |
| Transaction         | `https://lora.algokit.io/testnet/transaction/<TX_ID>`               |
| Asset (ASA / NFT)   | `https://lora.algokit.io/testnet/asset/<ASA_ID>`                    |
| Account             | `https://lora.algokit.io/testnet/account/<WALLET_ADDRESS>`          |

---

## Deployed AlgoSave Contract

| Field           | Value                                                                        |
|-----------------|------------------------------------------------------------------------------|
| **App ID**      | `755771019`                                                                  |
| **Network**     | Algorand Testnet                                                             |
| **Pera Explorer** | https://testnet.explorer.perawallet.app/application/755771019             |
| **Lora Explorer** | https://lora.algokit.io/testnet/application/755771019                    |

---

## Getting Testnet ALGO (Faucet)

Testnet ALGO is free — use any of these faucets:

| Faucet                           | URL                                                |
|----------------------------------|----------------------------------------------------|
| Algorand Foundation (official)   | https://bank.testnet.algorand.network              |
| Pera Wallet in-app               | Settings → Developer Mode → Dispense               |

**Steps (Algorand Foundation faucet):**
1. Copy your Testnet wallet address from Pera Wallet.
2. Visit https://bank.testnet.algorand.network.
3. Paste your address and click **Dispense** — 10 ALGO is sent immediately.

---

## Links Used in the AlgoSave UI

All explorer links in the app point to **Pera Explorer** (Testnet):

| Action                    | Code location                                            | Link pattern                                                 |
|---------------------------|----------------------------------------------------------|--------------------------------------------------------------|
| View last transaction     | `GoalDetailsClient.tsx`                                  | `testnet.explorer.perawallet.app/tx/<txId>`                  |
| View deposit transaction  | `GoalDetailsClient.tsx` (Deposit History table)          | `testnet.explorer.perawallet.app/tx/<txId>`                  |
| View minted NFT (ASA)     | `GoalDetailsClient.tsx` (ARC-3 Achievement NFT card)     | `testnet.explorer.perawallet.app/asset/<asaId>`              |
| View NFT mint transaction | `GoalDetailsClient.tsx` (ARC-3 Achievement NFT card)     | `testnet.explorer.perawallet.app/tx/<txId>`                  |
| Demo page app link        | `src/app/demo/page.tsx`                                  | `testnet.explorer.perawallet.app/application/<appId>`        |
| ARC-3 asset URL           | `src/lib/blockchain.ts` (`mintAchievementNFT`)           | `testnet.explorer.perawallet.app/application/<appId>#arc3`   |

---

## Verifying an AlgoSave Transaction

To verify a deposit or withdrawal from the Pera Explorer:
1. Find the transaction ID (shown in the AlgoSave UI after every on-chain action).
2. Open `https://testnet.explorer.perawallet.app/tx/<TX_ID>`.
3. Confirm:
   - **Type:** Application Call (for deposit / withdraw) or Payment.
   - **Application ID:** matches the AlgoSave vault's App ID.
   - **Sender:** your wallet address.
   - **Status:** Confirmed.

To verify an Achievement NFT:
1. After minting, copy the **ASA ID** shown in the goal details page.
2. Open `https://testnet.explorer.perawallet.app/asset/<ASA_ID>`.
3. Confirm:
   - **Total:** 1 (non-fungible).
   - **Decimals:** 0.
   - **URL:** ends with `#arc3` (ARC-3 compliance marker).
   - **Note (on creation tx):** contains the JSON achievement metadata.

---

## Why Testnet?

- **No real money** — Testnet ALGO has zero value, so experimentation is safe.
- **Identical to Mainnet** — the same smart contract code, transaction rules, and finality apply.
- **Free faucet** — any wallet can receive free Testnet ALGO for testing.
- **Public & transparent** — all Testnet transactions are publicly visible on block explorers.
