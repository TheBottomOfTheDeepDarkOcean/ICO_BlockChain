'use client'; // Bắt buộc phải có dòng này

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/src/themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}