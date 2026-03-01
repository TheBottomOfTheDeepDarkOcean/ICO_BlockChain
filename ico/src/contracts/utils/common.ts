export type AddressType = {
    11155111: string;
    1: string;
}

export enum CHAIN_ID {
    TESTNET = 11155111,
    MAINNET = 1,
}

export default function getChainIdFromEnv(): number {
    const env = process.env.NEXT_PUBLIC_CHAIN_ID;
    if (!env) { return 11155111;}
    return parseInt(env);
}

export const getRPC =() => {
    if (getChainIdFromEnv() === CHAIN_ID.MAINNET)
        return process.env.NEXT_PUBLIC_RPC_MAINNET;
    return process.env.NEXT_PUBLIC_RPC_TESTNET;
}
export const SMART_ADDRESS = {
    CROWD_SALE: {
        11155111: "0x75d0b8bB3A557f1Ea17d6FF0ddAcf9dd12187E7d", 1: ''},
    USDT: {
        11155111: "0x85AAba53a1c625b38c92507B23504E84D087fd97", 1: ''}
}