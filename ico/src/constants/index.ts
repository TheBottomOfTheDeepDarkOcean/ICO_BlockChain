import { IPackage, TOKEN } from "../_types_";

export const packages: IPackage[] = [
  {
    key: 'eth-01',
    name: 'ETH PACKAGE 01',
    amount: 1000,
    bg: 'eth_bg.png', // Đổi tên file ảnh nếu bạn có asset mới
    icon: 'eth_logo.png',
    token: TOKEN.ETH, // Giả định TOKEN enum của bạn đã có ETH
  },
  {
    key: 'eth-02',
    name: 'ETH PACKAGE 02',
    amount: 2000,
    bg: 'eth_bg.png',
    icon: 'eth_logo.png',
    token: TOKEN.ETH,
  },
  {
    key: 'eth-03',
    name: 'ETH PACKAGE 03',
    amount: 3000,
    bg: 'eth_bg.png',
    icon: 'eth_logo.png',
    token: TOKEN.ETH,
  },
  {
    key: 'usdt-01',
    name: 'USDT PACKAGE 01',
    amount: 1000,
    bg: 'usdt_bg.png',
    icon: 'usdt_logo.png',
    token: TOKEN.USDT, // Giữ nguyên vì USDT có mặt trên cả BSC và Sepolia
  },
  {
    key: 'usdt-02',
    name: 'USDT PACKAGE 02',
    amount: 2000,
    bg: 'usdt_bg.png',
    icon: 'usdt_logo.png',
    token: TOKEN.USDT,
  },
  {
    key: 'usdt-03',
    name: 'USDT PACKAGE 03',
    amount: 3000,
    bg: 'usdt_bg.png',
    icon: 'usdt_logo.png',
    token: TOKEN.USDT,
  },
];