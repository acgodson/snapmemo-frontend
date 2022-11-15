import {
  VStack,
  Grid,
  GridItem,
  Box,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { GlobalContext } from "contexts/contexts";
import { useContext, useEffect, useState } from "react";

const Gallery = (props: { onClose: () => void }) => {
  const [assets, setAssets] = useState<any[]>([]);
  const {
    user,
    twitterAuthCredential,
    createAsset,
    twitterProvider,
    assetList,
  }: any = useContext(GlobalContext);

  return (
    <>
      <VStack h="100vh" w="100%" bg="whitesmoke">
        <Box w="100%" overflow={"scroll"}>
          <VStack
            bg="white"
            w="100%"
            position="absolute"
            h="60px"
            p={0}
            m={0}
            boxShadow="sm"
          >
            <Box
              w="100%"
              px={6}
              mt={2}
              display={"flex"}
              alignItems="center"
              justifyContent="end"
            >
              <Button
                bg="#121D33"
                color="white"
                _hover={{
                  background: "blue.500",
                }}
                onClick={props.onClose}
              >
                Close Gallery
              </Button>
            </Box>
          </VStack>

          <VStack
            color="whiteAlpha.500"
            w="100%"
            h="100%"
            px={5}
            minH="100vh"
            m={0}
          >
            <Box h="80px" />

            <Box
              display="grid"
              w={"100%"}
              sx={{
                gridTemplateColumns: [
                  "repeat(1, 1fr)",
                  "repeat(1, 1fr)",
                  "repeat(3, 1fr)",
                ],
                gridGap: "25px",
              }}
            >
              {assetList &&
                assetList.map((x: any, i: number) => (
                  <Box key={Math.random()} bg={"#333"}>
                    <Box as="img" src={`${x.external_url}`} />
                    <VStack
                      bg={"blackAlpha.200"}
                      color="#333"
                      fontSize={"sm"}
                      fontWeight="semibold"
                      py={2}
                      w="100%"
                    >  
                      <Text></Text>
                      <Box>
                        <Box display="flex" alignItems={"center"}>
                          owner:
                          <Box
                            as="img"
                            src="twitter.png"
                            h="15px"
                            alt="twitter"
                            mr={1}
                            ml={1}
                          />
                         {twitterProvider ? twitterProvider.displayName : ""}
                        </Box>
                      </Box>
                    </VStack>
                  </Box>
                ))}
            </Box>
          </VStack>
        </Box>
      </VStack>
    </>
  );
};

export default Gallery;
function getssetsByName() {
  throw new Error("Function not implemented.");
}
