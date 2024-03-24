import dotenv from "dotenv";
import pkgWeb3 from "web3";

dotenv.config();

export const DEBUG = process.env.NODE_ENV !== "production";
export const DEBUG_REDUX = DEBUG;
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

// Networks for operations
export const NETWORKS = {
  UNDEFINED: undefined,
  LOCAL: {
    name: "local",
    id: "1337",
    url: "http://localhost",
    port: 8545,
  },
  MUMBAI: {
    name: "mumbai-polygon",
    id: "80001",
    url: `${process.env.MUMBAI_HOST}`,
    privKey: `${process.env.PRIV_KEY}`,
  },
  SEPOLIA: {
    name: "sepolia",
    id: "11155111",
    url: `${process.env.SEPOLIA_HOST}`,
    privKey: `${process.env.PRIV_KEY}`,
  },
  OPTIMISM_SEPOLIA: {
    name: "sepolia-optimism",
    id: "11155420",
    url: `${process.env.OPTIMISM_SEPOLIA_HOST}`,
    privKey: `${process.env.PRIV_KEY}`,
  },
  ARBITRUM_SEPOLIA: {
    name: "sepolia-arbitrum",
    id: "421614",
    url: `${process.env.ARBITRUM_SEPOLIA_HOST}`,
    privKey: `${process.env.PRIV_KEY}`,
  },
  HOLESKY: {
    name: "holesky",
    id: "17000",
    url: `${process.env.HOLESKY_HOST}`,
    privKey: `${process.env.PRIV_KEY}`
  },
};

// Networks for operations
export const NETWORKS_INGAME = {
  UNDEFINED: undefined,
  LOCAL: {
    name: "local",
    id: "1337",
    url: "http://localhost",
    port: 8545,
  },
  MUMBAI: {
    name: "mumbai-polygon",
    id: "80001",
    currencyName: "Mumbai-Matic",
    currencySymbol: "MATIC",
    rpcUrl: `https://matic-mumbai.chainstacklabs.com`,
    blockExplorer: "https://mumbai.polygonscan.com",
    explorer: {
      apiKey: `${process.env.REACT_APP_MUMBAI_EXPLORER_API_KEY}`,
      apiHost: `https://api-testnet.polygonscan.com`,
    },
  },
  SEPOLIA: {
    name: "sepolia",
    id: "11155111",
    currencyName: "Sepolia-ETH",
    currencySymbol: "SEP",
    rpcUrl: `https://rpc.sepolia.org`,
    blockExplorer: "https://sepolia.etherscan.io",
    explorer: {
      apiKey: `${process.env.REACT_APP_SEPOLIA_EXPLORER_API_KEY}`,
      apiHost: `https://api-sepolia.etherscan.io`,
    },
  },
  OPTIMISM_SEPOLIA: {
    name: "sepolia-optimism",
    id: "11155420",
    currencyName: "Optimism-ETH",
    currencySymbol: "ETH",
    rpcUrl: `https://sepolia.optimism.io`,
    blockExplorer: "https://sepolia-optimism.etherscan.io",
    explorer: {
      apiKey: `${process.env.REACT_APP_OPTIMISM_SEPOLIA_EXPLORER_API_KEY}`,
      apiHost: `https://api-sepolia-optimistic.etherscan.io`,
    },
  },
  ARBITRUM_SEPOLIA: {
    name: "sepolia-arbitrum",
    id: "421614",
    currencyName: "Arbitrum-ETH",
    currencySymbol: "ETH",
    rpcUrl: `https://sepolia-rollup.arbitrum.io/rpc`,
    blockExplorer: "https://sepolia.arbiscan.io",
    explorer: {
      apiKey: `${process.env.REACT_APP_ARBITRUM_SEPOLIA_EXPLORER_API_KEY}`,
      apiHost: `https://api-sepolia.arbiscan.io`,
    },
  },
  HOLESKY: {
    name: "holesky",
    id: "17000",
    currencyName: "Holesky-ETH",
    currencySymbol: "ETH",
    rpcUrl: "https://ethereum-holesky.publicnode.com",
    blockExplorer: "https://holesky.etherscan.io",
    explorer: {
      apiKey: `${process.env.REACT_APP_HOLESKY_EXPLORER_API_KEY}`,
      apiHost: `https://api-holesky.etherscan.io`,
    },
  },
};

// Deprectated networks
// status: {deprecated | deprecation-planned}
export const NETWORKS_DEPRECATION = {
  GOERLI: {
    id: "5",
    status: "deprecated",
    date: "jan-2024"
  },
  OPTIMISM_GOERLI: {
    id: "420",
    status: "deprecated",
    date: "jan-2024"
  },
  ARBITRUM_GOERLI: {
    id: "421613",
    status: "deprecated",
    date: "jan-2024"
  }
};

// Web3
export const Web3 = pkgWeb3;

// Misc
export const CLEAR_CONSOLE = !DEBUG;
export const GOOGLE_ANALYTICS_ID = "UA-85043059-4";

// Owner addresses
export const ADDRESSES = {
  [NETWORKS.LOCAL.name]: undefined,
  [NETWORKS.MUMBAI.name]: "0x09902A56d04a9446601a0d451E07459dC5aF0820",
  [NETWORKS.SEPOLIA.name]: "0x09902A56d04a9446601a0d451E07459dC5aF0820",  
  [NETWORKS.OPTIMISM_SEPOLIA.name]: "0x09902A56d04a9446601a0d451E07459dC5aF0820",
  [NETWORKS.ARBITRUM_SEPOLIA.name]: "0x09902A56d04a9446601a0d451E07459dC5aF0820",
  [NETWORKS.HOLESKY.name]: "0x09902A56d04a9446601a0d451E07459dC5aF0820",
};

// Support EIP-1559
export const SUPPORTS_EIP_1559 = [
  '5', // NETWORKS.GOERLI.id
  '80001', // NETWORKS.MUMBAI.id
  '11155111', // NETWORKS.SEPOLIA.id
]

// Core contract keys
export const CORE_CONTRACT_NAMES = [
  "ethernaut",
  "proxyAdmin",
  "implementation",
  "proxyStats",
];

// Storage
export const VERSION = "0.1.0";
export const STORAGE_PLAYER_DATA_KEY = `ethernaut_player_data_${VERSION}_`;
export const STORAGE_CONTRACT_DATA_KEY = `ethernaut_contract_data_`;

// Paths
export const PATH_ROOT = "/";
export const PATH_NOT_FOUND = "/404";
export const PATH_HELP = "/help";
export const PATH_LEVEL_ROOT = `${PATH_ROOT}level/`;
export const PATH_LEVEL = `${PATH_LEVEL_ROOT}:address`;
export const PATH_STATS = `${PATH_ROOT}stats`;
export const PATH_LEADERBOARD = `${PATH_ROOT}leaderboard`

// RELEASE SENSITIVE
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
export const CUSTOM_LOGGING = true; /* TRUE on production */
export const SHOW_ALL_COMPLETE_DESCRIPTIONS = false; /* FALSE on production */
export const SHOW_VERSION = true;

// export const ACTIVE_NETWORK = NETWORKS.SEPOLIA
// export const ACTIVE_NETWORK = NETWORKS.MUMBAI
// export const ACTIVE_NETWORK = NETWORKS.OPTIMISM_SEPOLIA
// export const ACTIVE_NETWORK = NETWORKS.ARBITRUM_SEPOLIA
// export const ACTIVE_NETWORK = NETWORKS.HOLESKY
// export const ACTIVE_NETWORK = NETWORKS.LOCAL;

let id_to_network = {};
Object.keys(NETWORKS)
  .filter(
    (network) => NETWORKS[network] /*&& NETWORKS[network].name !== 'local'*/
  )
  .forEach(
    (network) => (id_to_network[NETWORKS[network].id] = NETWORKS[network].name)
  );

export const ID_TO_NETWORK = id_to_network;
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

export const ALIAS_PATH = "https://raw.githubusercontent.com/OpenZeppelin/ethernaut-leaderboard/update/boards/aliases.json"

export const getLeaderboardPath = (network) => {
  return `https://raw.githubusercontent.com/OpenZeppelin/ethernaut-leaderboard/update/boards/networkleaderboards/${network}LeaderBoard.json`
}
