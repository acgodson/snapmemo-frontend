import React, { useState, useEffect } from "react";
import capsFirst from "../../utils/carousel/capsFirst";
import "fontsource-inter/500.css";

import {
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import ChakraCarousel from "./carouselSlide";

const previews = [
  {
    id: 1,
    src: "moment1.png",
    subtitle: "Let's make NFT Photographs",
  },
  {
    id: 2,
    src: "moment1.png",
    subtitle: "Save moments that  would last Forever",
  },

  {
    id: 3,
    src: "moment3.png",
    subtitle: "And Tweet about it...",
  },
];

function Preview() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(previews);
  }, []);

  return (
    <Container
      mt={4}
      py={8}
      maxW={{
        base: "100%",
        sm: "35rem",
        md: "43.75rem",
        lg: "57.5rem",
        xl: "75rem",
        xxl: "87.5rem",
      }}
    >
      <ChakraCarousel gap={32}>
        {data.map((x, index) => (
          <VStack my={6} px={3} key={index}>
            <Heading className="title" textAlign="center" w="full" mb={2}>
              {capsFirst(x.subtitle)}{" "}
            </Heading>
          </VStack>
        ))}
      </ChakraCarousel>
    </Container>
  );
}

export default Preview;
