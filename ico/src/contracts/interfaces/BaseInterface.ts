import { Interface } from "ethers";
import { InterfaceAbi } from "ethers";
import { TransactionResponse, TransactionReceipt } from "ethers"; // V6 gom chung vào 'ethers'
import { ethers, Overrides } from "ethers";

export default class BaseInterface {
  // V6 sử dụng BrowserProvider thay cho Web3Provider
  _provider: ethers.BrowserProvider | ethers.JsonRpcProvider;
  _contractAddress: string;
  _abis: InterfaceAbi; // Hoặc InterfaceAbi trong v6
  _contract: ethers.Contract;
  _option: Overrides;

  constructor(
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
    address: string,
    abi: any
  ) {
    this._provider = provider;
    this._contractAddress = address;
    this._abis = abi;
    this._option = { gasLimit: 300000 };
    
    // LƯU Ý: Trong v6, bạn nên khởi tạo contract với provider trước, 
    // sau đó mới connect signer khi cần thực hiện transaction (write).
    this._contract = new ethers.Contract(address, abi, provider);
  }

  _handleTransactionResponse = async (tx: TransactionResponse) => {
    try {
      const receipt = await tx.wait();
      return receipt?.hash || "";
      // return receipt?.hash; // V6 dùng .hash thay vì .transactionHash
    } catch (er: any) {
      throw new Error(er?.reason || `${er}`);
    }
  };

  _numberToEth = (amount: number) => {
    // V6: ethers.parseEther trực tiếp
    return ethers.parseEther(amount.toString());
  };

  _toNumber = (bigIntVal: bigint) => {
    try {
      return Number(bigIntVal);
    } catch (er) {
      return Number.parseFloat(ethers.formatEther(bigIntVal));
    }
  };

  _toEther = (bigIntVal: bigint) => {
    return Number.parseFloat(ethers.formatEther(bigIntVal));
  };

  _toWei = (amount: number) => {
    return ethers.parseUnits(amount.toString(), 18);
  };
}