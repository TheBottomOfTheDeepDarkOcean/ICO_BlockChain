// src/themes/index.ts
'use client';
import { ComponentStyleConfig, extendTheme } from '@chakra-ui/react'
import { config } from './config' // Import từ file config thô

const Button : ComponentStyleConfig = {
  variants: {
        'primary': {
          bg: '#fedf56',
          borderRadius: "8px",
          color: "#6a5809",
          fontWeight: 'bold',
          padding: "25px 30px",
          border: "1px solid #fedf56",
          fontSize: "15px",
          _hover: { bg: "#e5c94d" } // Thêm cái này cho chuyên nghiệp sếp ơi
        },
        'outline': {
          borderRadius: "5px",
          color: "#fedf56",
          fontWeight: 'bold',
          padding: "12px 36px",
          border: "1px solid rgba(254,223,86,.6) !important",
          _hover: { bg: "rgba(254,223,86,.1)" }
        },
      },
    }

const components = {
  Button
}

const theme = extendTheme({ config,   
  components  
 });
export default theme;