# ICO BlockChain - FloppyToken

This repository contains a decentralized Initial Coin Offering (ICO) platform. It includes a custom ERC-20 token implementation and a crowdsale smart contract to manage the token distribution.

## 📂 Project Structure

* **`FloppyToken/`**: Contains the Solidity smart contract for the **FloppyToken** (ERC-20 standard).
* **`ico/`**: Contains the crowdsale contract logic, deployment scripts, and configuration for the ICO.

## ✨ Key Features

* **Custom ERC-20 Token**: A fully compliant token built using OpenZeppelin standards.
* **Automated Crowdsale**: Secure logic for handling ETH contributions and automated token distribution.
* **Secure & Auditable**: Implementation follows security best practices to prevent common smart contract vulnerabilities.
* **Developer Friendly**: Clear separation between the token logic and the sale logic.

## 🛠 Tech Stack

* **Language**: Solidity
* **Framework**: [Hardhat](https://hardhat.org/)
* **Libraries**: [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
* **Tools**: Ethers.js, Dotenv

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies in both directories:
```bash
git clone [https://github.com/TheBottomOfTheDeepDarkOcean/ICO_BlockChain.git](https://github.com/TheBottomOfTheDeepDarkOcean/ICO_BlockChain.git)
cd ICO_BlockChain
npm install
```

### 2. Configuration

Create a `.env` file in FloppyToken folder

```env
SEPOLIA_PRIVATE_KEY="..."
ETHERSCAN_API_KEY="..."
```

Create a `.env` file in ico folder

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_TESTNET=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_RPC_MAINNET=https://cloudflare-eth.com
```

### 3. Deployment

Compile the smart contracts and deploy them to the Sepolia testnet or a local network:

```bash
# Compile contracts
yarn compile

# Deploy to Sepolia Testnet
yarn deploy sepolia

# Verify
yarn verify sepolia ico_address 100000 100000 account_receiver_address Floppy_address Usdt_address
```

### 4. Test
```bash
yarn dev -p 3001
```
