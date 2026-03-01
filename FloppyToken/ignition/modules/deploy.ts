import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenModule", (m) => {
  // const floppy = m.contract("Floppy");
  // const vault = m.contract("Vault");
  // const usdt = m.contract("USDT");

  const bnbRate = m.getParameter("BNB_RATE", "100000");
  const usdtRate = m.getParameter("USDT_RATE", "100000");
  const walletReceiver = m.getParameter("WALLET_RECEIVER", "0xf1d288fCB37FaB425Fe507fCb5c4Fe498D5a3909");
  const tokenAddress = m.getParameter("TOKEN_ADDRESS", "0x31b44bF6b20843c0602a5fe959e3bD414fc0323B");
  const usdtAddress = m.getParameter("USDT_ADDRESS", "0x85AAba53a1c625b38c92507B23504E84D087fd97");
  const ico = m.contract("FLPCrowdSale", [bnbRate, usdtRate, walletReceiver, tokenAddress, usdtAddress]);
  // return { floppy, vault };
  return { ico};
});