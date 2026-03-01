import { ethers, type InterfaceAbi } from 'ethers';
import BaseInterface from './BaseInterface';

class Erc20 extends BaseInterface {
  // 1. Trong v6, Web3Provider được thay bằng BrowserProvider
  constructor(
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider, 
    address: string, 
    abi: InterfaceAbi
  ) {
    super(provider, address, abi);
  }

  // Lấy số dư của một ví điện tử
  async balanceOf(walletAddress: string): Promise<number> {
    // Contract trong v6 trả về kiểu bigint cho các giá trị số
    const balance: bigint = await this._contract.balanceOf(walletAddress);
    return this._toNumber(balance);
  }

  // Lấy địa chỉ chủ sở hữu của Contract
  async owner(): Promise<string> {
    return await this._contract.owner();
  }

  // Lấy tổng cung của Token
  async totalSupply(): Promise<number> {
    const total: bigint = await this._contract.totalSupply();
    return this._toNumber(total);
  }

  // Lấy tên Token
  async name(): Promise<string> {
    return await this._contract.name();
  }

  // Lấy ký hiệu Token
  async symbol(): Promise<string> {
    return await this._contract.symbol();
  }

  // Cấp quyền cho một địa chỉ khác chi tiêu Token
  async approve(address: string, amount: number) {
    // 2. Trong v6, parseUnits nằm trực tiếp ở ethers, không nằm trong utils
    const wei = ethers.parseUnits(amount.toString(), 18);
    
    // 3. Với các hàm thay đổi dữ liệu (write), bạn cần kết nối Signer
    const signer = await this._provider.getSigner();
    const contractWithSigner = this._contract.connect(signer);
    
    // Gọi hàm approve thông qua instance đã có signer
    // @ts-ignore - Bỏ qua check type cho các hàm dynamic của contract
    const tx = await contractWithSigner.approve(address, wei, this._option);
    
    // Tận dụng hàm xử lý transaction từ BaseInterface
    return this._handleTransactionResponse(tx);
  }
}

export default Erc20;