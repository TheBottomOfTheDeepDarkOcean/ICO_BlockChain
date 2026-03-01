import {expect} from "chai";
import {ethers} from "hardhat";

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BaseContract, Contract } from "ethers";
import { Vault, Floppy } from "../typechain-types";

import * as chai from "chai";
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
import { keccak256 } from "ethers";

function parseEther(amount: Number) {
    return ethers.parseUnits(amount.toString(), 18);
}

describe("Vault", function () {
    let owner: HardhatEthersSigner,
    alice: HardhatEthersSigner,
    bob: HardhatEthersSigner,
    carol: HardhatEthersSigner;

    let vault: Vault;
    let token: Floppy;

    this.beforeEach(async () => {
        await ethers.provider.send("hardhat_reset", []);
        [owner, alice, bob, carol] = await ethers.getSigners();

        const Vault = await ethers.getContractFactory("Vault", owner);
        vault = (await Vault.deploy()) as unknown as Vault;
        await vault.waitForDeployment();

        const Token = await ethers.getContractFactory("Floppy", owner);
        token = await Token.deploy() as unknown as Floppy;
        await token.waitForDeployment();

        await vault.getFunction("setToken")(token.target);
    })

    //////// Happy Path
    it("Should deposit into the vault", async () => {
        const depositAmount = parseEther(500 * 10**3);
        const initialTransfer = parseEther(1 * 10**6);

        // Chuyển token cho Alice (Signer dùng .address)
        await token.transfer(alice.address, initialTransfer);
        
        // Alice approve cho Vault (Contract dùng .target)
        const aliceBalance = await token.balanceOf(alice.address);
        await token.connect(alice).approve(vault.target, aliceBalance);
        
        // Thực hiện deposit - IDE sẽ tự gợi ý hàm nhờ TypeChain
        await vault.connect(alice).deposit(depositAmount);
        
        // Kiểm tra kết quả
        expect(await token.balanceOf(vault.target)).to.equal(depositAmount);
    });

    it("Should withdraw", async () => {
        //grant withdrawer role to bob
        const WITHDRAWER_ROLE = await vault.getFunction("WITHDRAWER_ROLE")();
        await vault.getFunction("grantRole")(WITHDRAWER_ROLE, bob.address);

        // setter vault functions
        await vault.getFunction("setWithdrawEnable")(true);
        const maxWithdraw = parseEther(1 * 10**6);
        await vault.getFunction("setMaxWithdrawAmount")(maxWithdraw);

        // alice deposit into the vault
        await token.transfer(alice.address, parseEther(1 * 10**6));
        await token.connect(alice).approve(vault.target, await token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500 * 10**3));

        // bob withdraw into alice address
        await vault.connect(bob).withdraw(parseEther(300 * 10**3), alice.address);

        expect(await token.balanceOf(alice.address)).to.equal(parseEther(800 * 10**3));
        expect(await token.balanceOf(vault.target)).to.equal(parseEther(200 * 10**3));
    })

    //////////// Unhappy Path///////
    it("Should not deposit, Insufficient account balance", async () => {
        await token.transfer(alice.address, parseEther(1 * 10**6));
        await token.connect(alice).approve(vault.target, await token.balanceOf(alice.address));
        await expect(vault.connect(alice).deposit(parseEther(2 * 10**6))).revertedWith("Insufficient account balance");
    })
    
    it("Should not withdraw, Withdraw is not available", async () => {
        // grant withdrawer role to bob
        const WITHDRAWER_ROLE = await vault.getFunction("WITHDRAWER_ROLE")();
        await vault.getFunction("grantRole")(WITHDRAWER_ROLE, bob.address);

        // setter vault functions
        const maxWithdraw = parseEther(1 * 10**6);
        await vault.getFunction("setWithdrawEnable")(false);
        await vault.getFunction("setMaxWithdrawAmount")(maxWithdraw);

        // alice deposit into the vault
        await token.transfer(alice.address, parseEther(1 * 10**6));
        await token.connect(alice).approve(vault.target, await token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500 * 10**3));
        await expect(vault.connect(bob).withdraw(parseEther(300 * 10**3), alice.address)).revertedWith("Withdraw is not available");
    })

    it("Should not withdraw, Exceed maximum amount", async () => {
        // grant withdrawer role to bob
        const WITHDRAWER_ROLE = await vault.getFunction("WITHDRAWER_ROLE")();
        await vault.getFunction("grantRole")(WITHDRAWER_ROLE, bob.address);

        // setter vault functions
        await vault.getFunction("setWithdrawEnable")(true);
        const maxWithdraw = parseEther(1 * 10**3);
        await vault.getFunction("setMaxWithdrawAmount")(maxWithdraw);

        // alice deposit into the vault
        await token.transfer(alice.address, parseEther(1 * 10**6));
        await token.connect(alice).approve(vault.target, await token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500 * 10**3));
        await expect(vault.connect(bob).withdraw(parseEther(2 * 10**3), alice.address)).revertedWith("Exceed maximum amount");
    })

    it("Should not withdraw, Caller is not a withdrawer", async () => {
        // grant withdrawer role to bob
        const WITHDRAWER_ROLE = await vault.getFunction("WITHDRAWER_ROLE")();
        await vault.getFunction("grantRole")(WITHDRAWER_ROLE, bob.address);

        // setter vault functions
        await vault.getFunction("setWithdrawEnable")(true);
        const maxWithdraw = parseEther(1 * 10**3);
        await vault.getFunction("setMaxWithdrawAmount")(maxWithdraw);

        // alice deposit into the vault
        await token.transfer(alice.address, parseEther(1 * 10**6));
        await token.connect(alice).approve(vault.target, await token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500 * 10**3));
        await expect(vault.connect(carol).withdraw(parseEther(1* 10**3), alice.address)).revertedWith("Caller is not a withdrawer");
    })

    it("Should not withdraw, ERC20: transfer amount exceeds balance", async () => {
        // grant withdrawer role to bob
        const WITHDRAWER_ROLE = await vault.getFunction("WITHDRAWER_ROLE")();
        await vault.getFunction("grantRole")(WITHDRAWER_ROLE, bob.address);

        // setter vault functions
        await vault.getFunction("setWithdrawEnable")(true);
        const maxWithdraw = parseEther(5 * 10**3);
        await vault.getFunction("setMaxWithdrawAmount")(maxWithdraw);

        // alice deposit into the vault
        await token.transfer(alice.address, parseEther(1 * 10**6));
        await token.connect(alice).approve(vault.target, await token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(2 * 10**3));
        
        await expect(vault.connect(bob).withdraw(parseEther(3* 10**3), alice.address)).revertedWith("ERC20: transfer amount exceeds balance");
    })

})
