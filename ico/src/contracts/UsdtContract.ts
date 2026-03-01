import { ethers } from "ethers";
import { BaseInterface, Erc20 } from "./interfaces";
import { getUsdtAbi } from "./utils/getAbis";
import { getUsdtAddress } from "./utils/getAddress";

export default class UsdtContract extends Erc20 {
    constructor(provider: ethers.BrowserProvider) {
        super(provider, getUsdtAddress(), getUsdtAbi());
    }
}