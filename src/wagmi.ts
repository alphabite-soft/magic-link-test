import { http, createConfig, createConnector } from "wagmi";
import { Chain, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { dedicatedWalletConnector } from "@magiclabs/wagmi-connector";

const mySepolia: Chain = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia Ether",
    symbol: "SEP",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.infura.io/v3/1d30142720f54499ae2c3b7408d7c319"],
    },
    public: {
      http: ["https://sepolia.infura.io/v3/1d30142720f54499ae2c3b7408d7c319"],
    },
  },
};

const myBSCTestnet: Chain = {
  id: 97,
  name: "Binance Smart Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "tBNB",
  },
  rpcUrls: {
    default: { http: ["https://bsc-testnet-rpc.publicnode.com"] }, //https://rpc.ankr.com/bsc_testnet_chapel/9f6914a5aff50cd49cc2c80dff835479c8dad33870d0d950e584c79583e05423
    public: { http: ["https://bsc-testnet-rpc.publicnode.com"] }, //https://bsc-testnet-rpc.publicnode.com
  },
};

const myMumbai: Chain = {
  id: 80001,
  name: "Mumbai",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: {
      http: ["https://polygon-mumbai-bor-rpc.publicnode.com"],
      webSocket: ["wss://polygon-mumbai-bor-rpc.publicnode.com"],
    },
    public: {
      http: ["https://polygon-mumbai-bor-rpc.publicnode.com"],
      webSocket: ["wss://polygon-mumbai-bor-rpc.publicnode.com"],
    },
  },
};

const devNetworks: readonly [Chain, ...Chain[]] = [
  // mainnet,
  // polygon,
  // bsc,
  // fantom,
  // avalanche,
  mySepolia,
  //polygonMumbai,
  myMumbai,
  myBSCTestnet,
];

const correctNetworks = devNetworks;

const magicConnectors = correctNetworks //remove unsupported blockchains through filters
  .filter(
    (ch) =>
      !(ch.id === 43114 || ch.id === 43113 || ch.id === 250 || ch.id === 4002)
  ) //avalanche, avalancheFuji, fantom, fantomTestnet
  .map((ch) => {
    const dedicatedMagic = createConnector((config) => {
      const magic = dedicatedWalletConnector({
        chains: correctNetworks,
        options: {
          apiKey: "pk_live_21564F9D879F6638",
          // enableEmailLogin: true,
          // oauthOptions: { providers: ["google"] },
          magicSdkConfiguration: {
            network: {
              chainId: ch.id,
              rpcUrl: ch.rpcUrls.default.http[0],
            },
          },
          accentColor: "#0B61E1",
          customHeaderText: " ",
          customLogo:
            "https://a.storyblok.com/f/202037/1902x687/1df84f86b4/logo.png?cv=1700653221942",
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
  chains: [mainnet, sepolia],
  connectors: [...magicConnectors],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
