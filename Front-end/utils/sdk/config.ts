import { AbiItem } from "web3-utils";
import { toHex } from "./tools";
import { erc20 } from "./abis/erc20";
import { proxy, useSnapshot } from 'valtio';
// import { useProxy } from 'valtio/utils'
export const ERC20 = erc20 as AbiItem[];

export const chainIdDict: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  56: "Bsc Mainnet",
  97: "Bsc Testnet",
  137: "Polygon Mainnet",
  250: "Fantom Mainnet",
  4002: "Fantom Testnet",
  421614: "Arbitrum Sepolia Testnet",
};

const accountInfo = proxy({
  address: "",
  chainId: 1,
  chain: "",
  providerInfo: ""
});

export function useAccountInfo() {
  return useSnapshot(accountInfo);//Snapshot cannot be modified after export.
  // return useProxy(accountInfo);//this function can be modified;
}
export function UpdateAccountInfo() {
  accountInfo.address = userInfo.account;
  accountInfo.chainId = userInfo.chainID;
  accountInfo.chain = userInfo.chain;
}

export interface IuserInfo { account: string, chainID: 1 | 421614, chain: string, message: string }

export const userInfo: IuserInfo = {
  account: "",
  chainID: 1,
  chain: chainIdDict[1],
  message: "success",
};
export const ContractAddress = {
  1: {
    "L1": "0xA27989f75A33D093795E4A5eb6e25e67387cEBB1",
    "scan": "https://etherscan.io/",
  },
  421614: {
    "L1": "0xE022Ad497Edd470fF403ef49d66c7f5C5acF58Bd",
    "scan": "https://sepolia.arbiscan.io/",
  }
};
export interface tokenItem {
  symbol: string,
  id: string,
  decimals: number,
  chainid: number
}
/**
 * tokens
 */
export const tokens: tokenItem[] = [
  { decimals: 6, id: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", chainid: 1 },
  { decimals: 6, id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", chainid: 1 },
  { decimals: 6, id: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C", symbol: "USDT", chainid: 421614 },
  { decimals: 6, id: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4", symbol: "USDC", chainid: 421614 },
];
export const importTokens: tokenItem[] = [
  { decimals: 6, id: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", chainid: 1 },
  { decimals: 6, id: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", chainid: 1 },
  { decimals: 6, id: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C", symbol: "USDT", chainid: 421614 },
  { decimals: 6, id: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4", symbol: "USDC", chainid: 421614 }
];

export const Chains = {
  1: [{
    chainId: toHex(1),
    chainName: 'Ethereum Mainnet',
    nativeCurrency:
    {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/eth'],
    blockExplorerUrls: ['https://etherscan.io/'],
  }],
  97: [{
    chainId: toHex(97),
    chainName: 'Bsc Testnet',
    nativeCurrency:
    {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  }],
  421614: [{
    chainId: toHex(421614),
    chainName: 'Arbitrum Sepolia Testnet',
    nativeCurrency:
    {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
  }]
}