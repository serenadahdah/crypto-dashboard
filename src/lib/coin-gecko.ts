import Coingecko from "@coingecko/coingecko-typescript";

export const COIN_GECKO_CLIENT = new Coingecko({
    demoAPIKey: process.env.NEXT_PUBLIC_COINGECKO_API_KEY || "",
    environment: 'demo'
})

export type Coin = Coingecko.Coins.MarketGetResponse.MarketGetResponseItem
