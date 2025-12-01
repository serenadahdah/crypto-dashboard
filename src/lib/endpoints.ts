const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3/";

export const getFromCoinGecko = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(COINGECKO_API_BASE_URL + endpoint, {
    method: "GET",
    headers: {
      "x-cg-demo-api-key": process.env.NEXT_PUBLIC_COINGECKO_API_KEY || "",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error fetching data from CoinGecko: ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
};
