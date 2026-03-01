import { ignition, network } from "hardhat";
import TokenModule from "./deploy";
import * as Config from "../../scripts/config"; 

async function main() {
  const networkName = network.name; 
  
  // Chạy Ignition để deploy
  // const { floppy, vault } = await ignition.deploy(TokenModule);
  // const { usdt } = await ignition.deploy(TokenModule);
  const { ico } = await ignition.deploy(TokenModule);

  // Lấy địa chỉ thật (Lúc này mới có address thật, không phải 'Future')
  // const floppyAddr = await floppy.getAddress();
  // const vaultAddr = await vault.getAddress();
  // const usdtAddr = await usdt.getAddress();
  const icoAddr = await ico.getAddress();

  // Ghi vào file config.json của bạn
  await Config.initConfig();
  // Config.setConfig(networkName + ".Floppy", floppyAddr);
  // Config.setConfig(networkName + ".Vault", vaultAddr);
  // Config.setConfig(networkName + ".USDT", usdtAddr);
  Config.setConfig(networkName + ".ICO", icoAddr);
  await Config.updateConfig();

  console.log(`Đã lưu address của ${networkName} vào config.json!`);
}

main().catch(console.error);