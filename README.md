## Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```bash
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
```

### Where to get them

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_COINGECKO_API_KEY` | API key for fetching cryptocurrency data | Sign up at [CoinGecko](https://www.coingecko.com/en/api) and get a free Demo API key |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Project ID for WalletConnect integration | Create a project at [WalletConnect Cloud](https://cloud.walletconnect.com/) |
| `NEXT_PUBLIC_INFURA_API_KEY` | API key for Ethereum RPC endpoints | Sign up at [Infura](https://infura.io/) and create a new project |

## To run the development server:

```bash
pnpm dev
```

## Token Balance Checker - Test Addresses

You can use the following ERC-20 token contract addresses to test the Token Balance Checker feature.

### Ethereum Mainnet

| Token | Address |
|-------|---------|
| USDC | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| USDT (Tether) | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |
| DAI | `0x6B175474E89094C44Da98b954EescdeCB5BE3830` |
| WETH | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| LINK | `0x514910771AF9Ca656af840dff83E8264EcF986CA` |
| UNI | `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984` |
| SHIB | `0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE` |
| MATIC | `0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0` |

### Sepolia Testnet

| Token | Address |
|-------|---------|
| ETH (Native) | Use any wallet - ETH is the native currency, not an ERC-20 |
| USDC | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` |
| LINK | `0x779877A7B0D9E8603169DdbD7836e478b4624789` |
| WETH | `0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9` |

> **Note:** To get Sepolia testnet tokens, visit [Chainlink Faucets](https://faucets.chain.link/) or [Alchemy Sepolia Faucet](https://sepoliafaucet.com/).