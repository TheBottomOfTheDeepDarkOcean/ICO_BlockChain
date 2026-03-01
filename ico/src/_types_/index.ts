export interface IWalletInfo {
  address: string;
  eth: number;
}

export interface IRate {
    usdtRate: number;
    ethRate: number;
}

export enum TOKEN {
    ETH = "ETH",
    USDT = "USDT"
}

export interface IPackage {
    key: string;
    name: string;
    amount: number;
    icon: string;
    bg: string;
    token: TOKEN;
}