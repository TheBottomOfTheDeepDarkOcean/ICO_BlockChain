// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FLPCrowdSale is Ownable {
    using SafeERC20 for IERC20;

    address payable public wallet;

    uint256 public ETH_rate;   // đổi từ BNB_rate
    uint256 public USDT_rate;

    IERC20 public token;
    IERC20 public usdtToken;

    event BuyTokenByETH(address buyer, uint256 amount);
    event BuyTokenByUSDT(address buyer, uint256 amount);
    event SetUSDTToken(address tokenAddress);
    event ETHRateChanged(uint256 newRate);
    event USDTRateChanged(uint256 newRate);

    constructor(
        uint256 eth_rate,
        uint256 usdt_rate,
        address payable _wallet,
        IERC20 icotoken,
        IERC20 _usdtToken
    ) Ownable(msg.sender) {
        ETH_rate = eth_rate;
        USDT_rate = usdt_rate;
        wallet = _wallet;
        token = icotoken;
        usdtToken = _usdtToken;
    }

    function setUSDTToken(IERC20 token_address) public onlyOwner {
        usdtToken = token_address;
        emit SetUSDTToken(address(token_address));
    }

    function setETHRate(uint256 newRate) public onlyOwner {
        ETH_rate = newRate;
        emit ETHRateChanged(newRate);
    }

    function setUSDTRate(uint256 newRate) public onlyOwner {
        USDT_rate = newRate;
        emit USDTRateChanged(newRate);
    }

    // ===== MUA TOKEN BẰNG ETH (Sepolia) =====
    function buyTokenByETH() external payable {
        uint256 ethAmount = msg.value;
        uint256 amount = getTokenAmountETH(ethAmount);

        require(amount > 0, "Amount is zero");
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient contract balance"
        );

        wallet.transfer(ethAmount);
        token.safeTransfer(msg.sender, amount);

        emit BuyTokenByETH(msg.sender, amount);
    }

    // ===== MUA TOKEN BẰNG USDT =====
    function buyTokenByUSDT(uint256 usdtAmount) external {
        uint256 amount = getTokenAmountUSDT(usdtAmount);

        require(amount > 0, "Amount is zero");
        require(
            token.balanceOf(address(this)) >= amount,
            "Insufficient contract balance"
        );
        require(
            usdtToken.balanceOf(msg.sender) >= usdtAmount,
            "Insufficient USDT balance"
        );

        usdtToken.safeTransferFrom(msg.sender, wallet, usdtAmount);
        token.safeTransfer(msg.sender, amount);

        emit BuyTokenByUSDT(msg.sender, amount);
    }

    function getTokenAmountETH(uint256 ethAmount)
        public
        view
        returns (uint256)
    {
        return ethAmount * ETH_rate;    
    }

    function getTokenAmountUSDT(uint256 usdtAmount)
        public
        view
        returns (uint256)
    {
        return usdtAmount * USDT_rate;
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawErc20() public onlyOwner {
        usdtToken.safeTransfer(
            msg.sender,
           usdtToken.balanceOf(address(this))
        );
    }
}
