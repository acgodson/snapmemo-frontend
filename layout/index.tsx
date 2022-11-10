import React from "react";
import Head from "next/head";
import {
  Box,
  HStack,
  Stack,
  VStack,
  Text,
  Avatar,
  Link,
} from "@chakra-ui/react";
// import dynamic from "next/dynamic";

function Layout({ children }) {
  return (
    <>
      <React.Fragment>
        <Head>
          <title>Snapmemo</title>
          <meta property="og:title" content="snapmemo"></meta>
          <meta
            name="description"
            content="Save moments that would last forever on web3.storage"
          />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <main
          style={{
            marginTop: "0px",
            padding: 0
          }}
        >
          {children}
        </main>
        <footer>
          <VStack className="footer" fontSize="sm" width="100%" px={6}>
            <Box w="100%" textAlign="center">
              By uploading images to this site you agree to our
              <Link href={""} color="#4E96EC">
                Terms Of Use{" "}
              </Link>
              and{" "}
              <Link href={""} color="#4E96EC">
                {" "}
                privacy policy
              </Link>
            </Box>
            <Box>
              &copy; 2022
              <Box as="span" color="#4E96EC">
                {" "}
                |{" "}
              </Box>
              Github{" "}
              <Box as="span" color="#4E96EC">
                {" "}
                |{" "}
              </Box>{" "}
              Discord
            </Box>
          </VStack>
        </footer>{" "}
      </React.Fragment>
    </>
  );
}

export default Layout;
