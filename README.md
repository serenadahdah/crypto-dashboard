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
pnpm install
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

---

## Features Implemented

### Part 1: Crypto Price Tracker (Core Features)

#### Token Listing Page

- **Data Table** displaying top cryptocurrencies with: Icon, Name and symbol, Current price in USD, 24h price change (% with color coding: green for positive, red for negative), Market cap, 24h trading volume
- **Search functionality** — Filter coins by name or symbol (FE filtering current page)
- **Sort functionality** — Sortable columns for price(FE sorting), market cap(API sorting), 24h change, and volume
- **Pagination** — Navigate through pages with customizable page size (10, 20, 30, 50, 100, 200)
- **URL-based state** — Sorting, search, and pagination are stored in URL params for refresh persistence and shareable links
- **Fully responsive** — Optimized layout for mobile, tablet, and desktop
- **Loading states** — Skeleton loaders and loading indicators while fetching data
- **Auto-refresh** — Prices automatically update every 60 seconds

#### Trending Tokens Section

- Horizontal scrollable list of trending cryptocurrencies
- Displays: logo, name, symbol, market cap rank, and 24h price change
- Visually distinct design with hover effects

#### Navigation

- Collapsible sidebar navigation
- Links to: Coins (Home) and Wallet pages
- Active page indicator highlighting current route
- Responsive design with hamburger menu behavior
- Wallet connect button prominently displayed in header
- Connected wallet address shown in navigation when connected

### Part 2: Web3 Integration

#### Wallet Connection (RainbowKit)

- Multiple wallet support (MetaMask, Rainbow, Base Account)
- When connected displays:
  - Wallet address formatted
  - ETH balance
  - Current network (chain name)
  - Disconnect option
- **Multi-network support**: Ethereum Mainnet, Sepolia Testnet, Polygon
- Error handling for connection issues
- Loading states during wallet interactions

#### Token Balance Checker

- Input field for ERC-20 token contract address
- Displays token balance, name, and symbol
- Formatted balance display (handles various decimal places)
- Error handling for invalid addresses or non-ERC20 contracts

#### Send ETH Transaction

- Send test ETH on **Sepolia testnet**
- Form with:
  - Recipient address (with validation)
  - Amount in ETH (with safety limits)
- Real-time transaction status tracking (pending → confirming → success/failed)
- Transaction hash with direct link to Etherscan
- Toast notifications for transaction updates
- Comprehensive error handling (insufficient funds, rejected, invalid address)
- Network switching prompt when not on Sepolia

## Implementation Notes

### Custom Hooks Created

- **`useIsMobile`** — Detects screen size to adapt UI (sidenav, fewer pagination numbers on mobile)
- **`usePaginationParams`** — Syncs pagination with URL params for refresh persistence and shareable links
- **`useTableSorting`** — Manages sort state with URL sync

### URL-Based State

Pagination and sorting are stored in **URL query parameters** (`?page=2&pageSize=20&sort=price_desc`):

- Users stay on the same page after refresh
- Links are shareable, send someone a specific page
- Browser back/forward buttons work as expected

### Design Notes

- Hidden scrollbar on trending cards appears only on hover for cleaner UI
- "Reset" button for table clears search, sort, and returns to page 1
- Hover effects on cards for interactivity
- React Query caching with `keepPreviousData` for smooth transitions
- Overall design could use more artistic polish

### Issues, Limitations & Future Improvements

| Issue                 | Current State                                               | To Be Improved                                    |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| Search                | Implemented client-side (filters current page only)         | Use CoinGecko endpoint instead of FE filtering    |
| Price/Change Sorting  | Client-side (current page)                                  | API doesn't support, needs workaround             |
| Search + Reset Layout | Search label gets cut when Reset button appears on mobile   | Improve flex layout or reduce label on mobile     |
| Pagination on Mobile  | Goes outside table on high page numbers                     | Reduce `currentSiblings` to 0 using `useIsMobile` |
| Wallet Buttons        | Not responsive, disrupts header on mobile when connected    | Make the buttons responsive                       |
| Overall Design        | Basic, serves purpose                                       | Add artistic touch, better typography/colors      |
| Token Detail Page     | Not implemented                                             | Not time consuming, should be added               |
| Web3 Testing          | Basic flows only                                            | Deeper testing needed                             |
| Mobile Testing        | Limited to iPhone and browser dev tools, no Android testing | Test on Android devices for better coverage       |

---

## Time Estimation

- **Duration:** 4 days
- **Daily effort:** 2-5 hours per day
- **Total:** ~10-18 hours of development
