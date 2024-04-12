import { http, createConfig, createConnector } from "wagmi";
import { Chain, polygonMumbai, sepolia, bscTestnet } from "wagmi/chains";
import { dedicatedWalletConnector } from "@magiclabs/wagmi-connector";

const devNetworks: readonly [Chain, ...Chain[]] = [
  polygonMumbai,
  sepolia,
  bscTestnet,
];

const correctNetworks = devNetworks;

const magicConnectors = correctNetworks.map((ch) => {
  const dedicatedMagic = createConnector((config) => {
    const magic = dedicatedWalletConnector({
      chains: correctNetworks,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
        magicSdkConfiguration: {
          network: {
            chainId: ch.id,
            rpcUrl: ch.rpcUrls.default.http[0],
          },
        },
        networks: correctNetworks.map((ch) => ({
          chainId: ch.id,
          rpcUrl: ch.rpcUrls.default.http[0],
        })),
      },
    });

    return {
      ...magic(config),
      name: `${ch.name}`,
      id: `magic-${ch.id}`,
    };
  });
  return dedicatedMagic;
});

export const config = createConfig({
  chains: correctNetworks,
  connectors: [...magicConnectors],
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [bscTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
