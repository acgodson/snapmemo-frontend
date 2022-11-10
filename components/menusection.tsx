import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  IconButton,
  VStack,
  Text,
  Button,
  Divider,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { GlobalContext } from "contexts/contexts";
import { CopyToClipboard } from "react-copy-to-clipboard";
import React, { useContext } from "react";
import Link from "next/link";

const MenuSection = (props: { onToggle: () => void }) => {
  const { user, account, balance, loginWeb3, logout, twitterProvider }: any =
    useContext(GlobalContext);
  const toast = useToast();

  function showCopied() {
    toast({
      title: "Address Copied to Clipboard",
      status: "info",
      duration: 9000,
      isClosable: true,
    });
  }

  return (
    <>
      <Box
        width="100%"
        position="absolute"
        overflow="hidden"
        minH="100vh"
        bgColor="blackAlpha.500"
        margin={0}
        marginTop="-10px"
      >
        <Box
          w={["100%", "100%", "500px"]}
          bgColor="white"
          h="100vh"
          float="right"
          px={[3, 3, 6]}
          pt={0}
          pb={10}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
          >
            <Box
              as="span"
              ml={0}
              fontSize="26px"
              fontWeight="700"
              color="rgb(53, 63, 82)"
              opacity={0.9}
            >
              Settings
            </Box>

            <IconButton
              size={"md"}
              color="grey"
              borderRadius="50%"
              bgColor="whitesmoke"
              icon={<CloseIcon />}
              aria-label={"Open Menu"}
              display={["inherit", "inherit", "inherit"]}
              onClick={() => {
                props.onToggle();
              }}
            />
          </Box>

          <VStack spacing={2} alignItems="start" justifyContent="start" px={3}>
            <Box
              fontWeight="700"
              letterSpacing={0.5}
              color="blue.500"
              opacity={0.8}
              mt={3}
              px={3}
            >
              Account
            </Box>

            <VStack
              justifyContent="start"
              width="100%"
              alignItems="start"
              px={3}
              py={2}
            >
              <Text fontWeight="700">ID</Text>
              <Text color="grey">{user.id}</Text>
            </VStack>

            <VStack
              justifyContent="start"
              width="100%"
              alignItems="start"
              px={3}
              py={2}
            >
              <Text fontWeight="700">Balance</Text>
              <Text color="grey">{balance} ALGOs</Text>

              <HStack width="100%" px={3} justifyContent="space-between">
                <Link href="https://dispenser.testnet.aws.algodev.network/">
                  <Button>Fund Account</Button>
                </Link>

                <CopyToClipboard
                  text={account}
                  onCopy={() => {
                    showCopied();
                  }}
                >
                  <Button>Copy Address</Button>
                </CopyToClipboard>
              </HStack>
            </VStack>

            <VStack
              justifyContent="start"
              width="100%"
              alignItems="start"
              px={3}
              py={2}
            >
              <Text fontWeight="700">Default Storage</Text>
              <Text color="grey">Web3.storage</Text>
            </VStack>

            <Divider />

            <Box
              fontWeight="700"
              letterSpacing={0.5}
              color="blue.500"
              opacity={0.8}
              mt={3}
              px={3}
            >
              Connected to :
            </Box>

            <HStack
              width="100%"
              display="flex"
              px={3}
              justifyContent="space-between"
            >
              <Box display="flex">
                <Box as="span">
                  <Box
                    as="img"
                    src="twitter.png"
                    alt="twitter"
                    fontSize="16px"
                    mr={2}
                  />
                </Box>
                {twitterProvider ? twitterProvider.displayName : ""}
              </Box>

              <Button onClick={() => logout()}>Logout</Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </>
  );
};

export default MenuSection;
