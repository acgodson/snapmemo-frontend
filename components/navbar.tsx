import { Box, Button, HStack, Text } from "@chakra-ui/react";
import React from "react";

const NavBar = (props: { onSend: () => void }) => {
  return (
    <>
      <HStack w="100%" h="80px">
        <Button
          className="nav-button"
          alignItems="center"
          display="flex"
          onClick={props.onSend}
        >
          <Box as="span" display={["block", "block", "none"]}>
            <Box as="img" alt="menu" src="/menu.png" />
          </Box>
          <Text display={["none", "none", "block"]}> ALGORAND TESTNET</Text>
        </Button>
      </HStack>
    </>
  );
};

export default NavBar;
