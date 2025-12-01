import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  metaMaskWallet,
  baseAccount,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon } from "wagmi/chains";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rainbowWallet, baseAccount],
    },
  ],
  {
    appName: "Crypto Dashboard",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  },
);

export const config = createConfig({
  connectors,
  chains: [mainnet, sepolia, polygon],
  transports: {
    [mainnet.id]: http(
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    ),
    [sepolia.id]: http(
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    ),
    [polygon.id]: http(
      `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    ),
  },
  ssr: true,
});
