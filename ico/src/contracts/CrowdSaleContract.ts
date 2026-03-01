import { ethers, type TransactionResponse } from "ethers"; // V6 import trực tiếp từ 'ethers'
import BaseInterface from "./interfaces/BaseInterface";
// Giả định các hàm helper này đã được định nghĩa
import { getRPC } from "./utils/common";
import { getCrowdSaleAbi } from "./utils/getAbis";
  // import { getCrowdSaleAddress } from "./utils/getAddress";
import { getCrowdSaleAddress } from "./utils/getAddress";
export default class CrowSaleContract extends BaseInterface {
  constructor(provider?: ethers.BrowserProvider) {
    // 1. Trong v6: Web3Provider -> BrowserProvider
    const rpcProvider = new ethers.JsonRpcProvider(getRPC());
    
    // Gọi constructor cha
    super(provider || rpcProvider, getCrowdSaleAddress(), getCrowdSaleAbi());

    // 2. Nếu không có provider ví, khởi tạo contract chỉ để đọc (Read-only)
    if (!provider) {
      this._contract = new ethers.Contract(this._contractAddress, this._abis, rpcProvider);
    }
  }

  // Lấy tỉ giá quy đổi ETH/Token
  async getEthRate(): Promise<number> {
    const rate: bigint = await this._contract.ETH_rate();
    return this._toNumber(rate);
  }

  // Lấy tỉ giá quy đổi USDT/Token
  async getUsdtRate(): Promise<number> {
    const rate: bigint = await this._contract.USDT_rate();
    return this._toNumber(rate);
  }

  // Thực hiện mua Token bằng ETH
  async buyTokenByETH(amount: number): Promise<string> {
    const rate = await this.getEthRate();
    
    // 3. Trong v6: Cần lấy signer vì getSigner() là hàm async
    const signer = await (this._provider as ethers.BrowserProvider).getSigner();
    const contractWithSigner = this._contract.connect(signer) as any;

    // Tính toán số lượng ETH cần gửi: $Value = \frac{Amount}{Rate}$
    const tx: TransactionResponse = await contractWithSigner.buyTokenByETH({
      ...this._option,
      value: this._numberToEth(amount / rate),
    });
    
    return this._handleTransactionResponse(tx);
  }

  // Thực hiện mua Token bằng USDT
  async buyTokenByUSDT(amount: number) : Promise<string> {
    const rate = await this.getUsdtRate();
    
    const signer = await (this._provider as ethers.BrowserProvider).getSigner();
    const contractWithSigner = this._contract.connect(signer) as any;

    const tx: TransactionResponse = await contractWithSigner.buyTokenByUSDT(
      this._numberToEth(amount / rate),
      this._option
    );
    
    return this._handleTransactionResponse(tx);
  }
}