import React, { useEffect } from "react";
import "../styles/styles.css"
import "../styles/fonts.css"
import Layout from "../layout/index";
import { AppProps } from "next/app";
import GlobalProvider from "../contexts/contexts";
import { ChakraProvider } from "@chakra-ui/react";


function MyApp({ Component, pageProps }: AppProps) {
  return (
   
    <GlobalProvider >
      <ChakraProvider>  
        <Layout>
          <Component {...pageProps} />
        </Layout>    
        </ChakraProvider>
        </GlobalProvider>

  );
}

export default MyApp;


