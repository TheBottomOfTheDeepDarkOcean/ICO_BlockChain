import {Button, HStack, Image, Text} from "@chakra-ui/react";
import React from "react";
import {numberFormat, showShortAddress} from "@/src/utils";

interface IProps {
  address: string;
  amount: number;
}

export default function WalletInfo({address, amount}: IProps) {
  return (
    <Button variant="outline" ml="10px">
      <HStack>
        <Text>{showShortAddress(address)}</Text>
        <Image src="/eth_logo.png" alt="eth" boxSize="20px"/>
        <Text>{numberFormat(amount)} ETH</Text>
      </HStack>
    </Button>
  );
}