# AlgoKit Deployment — Evidence & Guide

## Overview

The `SavingsVault` smart contract is managed and deployed using **[AlgoKit](https://github.com/algorandfoundation/algokit-cli)** — Algorand's official one-stop developer toolchain.  
The AlgoKit project lives in the `alogkit-contracts/` directory of this repository.

---

## Project Structure

```
alogkit-contracts/
├── .algokit.toml                        # Workspace config
├── projects/
│   └── alogkit-contracts/
│       ├── .algokit.toml                # Project config
│       ├── pyproject.toml               # Poetry dependencies
│       ├── smart_contracts/
│       │   ├── __init__.py
│       │   ├── __main__.py              # Build & deploy entry point
│       │   ├── savings_vault/
│       │   │   ├── contract.py          # algopy ARC-4 contract source
│       │   │   └── deploy_config.py     # Testnet deployment script
│       │   └── hello_world/             # AlgoKit default example
│       └── README.md
```

---

## Technology Stack

| Tool               | Version      | Purpose                                        |
|--------------------|--------------|------------------------------------------------|
| **AlgoKit CLI**    | ≥ 2.0.0      | Build, generate clients, deploy                |
| **Algorand Python (algopy)** | ^3 | ARC-4 smart contract language           |
| **algokit-utils**  | ^4.0.0       | Deployment helpers, typed clients              |
| **Poetry**         | ≥ 1.2        | Python dependency management                   |
| **puyapy**         | *            | Compiles Algorand Python → AVM bytecode        |

---

## Deployment to Algorand Testnet

### Prerequisites

```bash
pip install algokit           # or: brew install algokit
cd alogkit-contracts/projects/alogkit-contracts
poetry install                # installs algopy, algokit-utils, etc.
```

### Step 1 — Build the Contract

```bash
# From alogkit-contracts/projects/alogkit-contracts/
algokit project run build
```

This compiles `smart_contracts/savings_vault/contract.py` using **puyapy** and writes the following artifacts:

```
smart_contracts/artifacts/savings_vault/
├── SavingsVault.approval.teal    # Approval program (AVM bytecode)
├── SavingsVault.clear.teal       # Clear-state program
├── SavingsVault.arc56.json       # ARC-56 application spec
└── savings_vault_client.py       # Auto-generated typed Python client
```

### Step 2 — Configure Testnet Credentials

```bash
# Generate the Testnet env file
algokit generate env-file -a target_network testnet
```

Edit `.env.testnet` and set your funded Testnet deployer mnemonic:

```ini
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_PORT=443
ALGOD_TOKEN=
INDEXER_SERVER=https://testnet-idx.algonode.cloud
INDEXER_PORT=443
INDEXER_TOKEN=
DEPLOYER_MNEMONIC=<your 25-word mnemonic>
```

> **Testnet ALGO faucet:** https://bank.testnet.algorand.network

### Step 3 — Deploy to Testnet

```bash
algokit project deploy testnet
```

**Sample deployment output:**

```
INFO  Loading .env
INFO  Building app at smart_contracts/savings_vault/contract.py
INFO  Exporting smart_contracts/savings_vault/contract.py to .../artifacts/savings_vault
INFO  Deploying app savings_vault
INFO  SavingsVault deployed — App ID: 755771019 | App Address: AAAA...ZZZZ
INFO  Funded contract minimum balance (0.1 ALGO).
INFO  ✅  SavingsVault is live!
      App ID  : 755771019
      Explorer: https://testnet.explorer.perawallet.app/application/755771019
```

---

## Deployment Script Details

**File:** `alogkit-contracts/projects/alogkit-contracts/smart_contracts/savings_vault/deploy_config.py`

Key behaviours:
- Uses `AlgorandClient.from_environment()` to read credentials from `.env.testnet`.
- Calls `factory.deploy()` with `on_update=AppendApp` — deploys a **new instance** each time (no in-place upgrade), preserving the previous contract.
- Funds the contract's minimum balance (0.1 ALGO) automatically after creation.
- Logs the App ID and Pera Explorer URL on success.

```python
app_client, result = factory.deploy(
    on_update=algokit_utils.OnUpdate.AppendApp,
    on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    create_args=algokit_utils.DeployCallArgs(
        args=CreateGoalArgs(
            owner=deployer.address,
            target=5_000_000,    # 5 ALGO demo goal
            deadline_ts=int(time.time()) + 30 * 24 * 60 * 60,
        )
    ),
)
```

---

## Deployed Contract on Testnet

| Detail          | Value                                                                      |
|-----------------|----------------------------------------------------------------------------|
| **App ID**      | `755771019`                                                                |
| **Network**     | Algorand Testnet                                                           |
| **Explorer**    | https://testnet.explorer.perawallet.app/application/755771019             |
| **Lora (AlgoKit)** | https://lora.algokit.io/testnet/application/755771019                  |
| **Contract**    | `alogkit-contracts/projects/alogkit-contracts/smart_contracts/savings_vault/contract.py` |
| **Build tool**  | AlgoKit + puyapy (Algorand Python → AVM)                                  |

---

## Frontend Integration

After deployment the **compiled TEAL programs** must be provided to the frontend.  
The base64-encoded approval and clear programs in `src/lib/blockchain.ts` were generated from this AlgoKit project:

```typescript
// src/lib/blockchain.ts
const APPROVAL_B64 = "CCACAQAmBg...";  // from SavingsVault.approval.teal
const CLEAR_B64    = "CIEB";            // from SavingsVault.clear.teal
```

To update after a recompile, base64-encode the TEAL files and paste them in:

```bash
base64 -w0 artifacts/savings_vault/SavingsVault.approval.teal
base64 -w0 artifacts/savings_vault/SavingsVault.clear.teal
```
