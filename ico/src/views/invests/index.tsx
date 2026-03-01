'use client';

declare var window: any;
import React from "react";
import { Flex, Heading, Spacer } from "@chakra-ui/react";
import { ConnectWallet, SuccessModal, WalletInfo } from "@/src/components";
import { IPackage, IRate, IWalletInfo } from "@/src/_types_";
import { ethers } from "ethers";
import { SimpleGrid } from "@chakra-ui/react";
import { packages} from "@/src/constants";
import {TOKEN} from "@/src/_types_";
import { i } from "framer-motion/client";
import UsdtContract from "@/src/contracts/UsdtContract";
import CrowSaleContract from "@/src/contracts/CrowdSaleContract";
import { useDisclosure } from '@chakra-ui/react';

import InvestCard from "@/src/views/invests/components/InvestCard";
export default function InvestView() {
  const [wallet, setWallet] = React.useState<IWalletInfo>();
  const [rate, setRate] = React.useState<IRate>({
    ethRate: 0,
    usdtRate: 0,
  });
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [pak, setPak] = React.useState<IPackage>();
  const [txHash, setTxHash] = React.useState<string>();
  const {isOpen, onClose, onOpen} = useDisclosure();
  const [Web3Provider, setWeb3Provider] = React.useState<ethers.BrowserProvider>();

  const getRate = React.useCallback(async() => {
    const crowdContract = new CrowSaleContract();
    const ethRate = await crowdContract.getEthRate();
    const usdtRate = await crowdContract.getUsdtRate();
    // console.log("bnbRate", bnbRate);
    // console.log("usdtRate", usdtRate);
    setRate({
      ethRate,
      usdtRate,
    });
  }, []);

  React.useEffect(() => {
    getRate();
  }, [])

  const onConnectMetamask = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum, undefined);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const bigBalance = await provider.getBalance(address);
      const ethBalance = Number.parseFloat(ethers.formatEther(bigBalance));
      setWallet({
          address,
          eth: ethBalance,
        });
      setWeb3Provider(provider);
    }
  }

  const handleBuyIco = async (pk: IPackage) => {
    if (!Web3Provider) return;
    setPak(pk);
    setIsProcessing(true);

    let hash ='';
    const crowdContract = new CrowSaleContract(Web3Provider);

    if (pk.token === TOKEN.USDT) {
      const usdtContract = new UsdtContract(Web3Provider);
      await usdtContract.approve(crowdContract._contractAddress, pk.amount / rate.ethRate);
      hash = await crowdContract.buyTokenByUSDT(pk.amount);
    } else {
      hash = await crowdContract.buyTokenByETH(pk.amount)
    }
    setTxHash(hash);
    onOpen();
    try {
      
    } catch (er: any) {
      
    }
    setPak(undefined);
    setIsProcessing(false);
  }


  return (
    <Flex
      w={{base: "full", lg: "70%"}}
      flexDirection="column"
      margin="50px auto"
    >
        <Flex>
            <Heading 
                size="lg"
                fontWeight="bold">
                    Blockchain Trainee
            </Heading>
            <Spacer />
            {!wallet && <ConnectWallet onClick={onConnectMetamask}/>}
            {wallet &&
            <WalletInfo 
              address={wallet?.address || ""}
              amount={wallet?.eth || 0} />}
        </Flex>
        <SimpleGrid columns={{base: 1, lg: 3}} spacing={40} mt="50px" spacingY="20px" >
              {packages.map((pk, index) => (
                <InvestCard 
                  pak={pk}
                  key={String(index)}
                  // Kiểm tra xem gói này có đang trong quá trình mua không
                  isBuying={isProcessing && pak?.key === pk.key}
                  // // Hiển thị tỉ giá dựa trên loại token (ETH hoặc USDT)
                  rate={pk.token === TOKEN.ETH ? rate?.ethRate : rate?.usdtRate}
                  walletInfo={wallet}
                  onBuy={() => handleBuyIco(pk)}
                />
              ))}
        </SimpleGrid>
        <SuccessModal
          isOpen={isOpen}
          onClose={onClose}
          title="Buy ICO"
          hash={txHash}
        />
    </Flex>
  );
}