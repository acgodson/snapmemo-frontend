import { Box, VStack } from "@chakra-ui/react";
import { GlobalContext } from "contexts/contexts";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

const homeLoader = () => {
  const { user, provider }: any = useContext(GlobalContext);
  let router = useRouter();
  function navigate(path: string) {
    router.push(path);
  }

useEffect(() => {
 
  if (user) {
    navigate("/home");
  } else {
    navigate("/signin")
  }

});



  return (
    <>
      <VStack className= "loader" w="100%" h="100vh" justifyContent="center" alignItems="center">
        <Box as="img"
         src="/loading.gif"
          alt="bgg"
          height="auto"
          width="250px"
        />
      </VStack>
    </>
  );
};

export default homeLoader;
