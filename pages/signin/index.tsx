import React, { useContext } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Stack,
  VStack,
  useToast,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import Preview from "components/carousel/preview";
import { GlobalContext } from "contexts/contexts";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import dynamic from "next/dynamic";

const auth = getAuth();
const tProvider = new TwitterAuthProvider();

function SignIn() {
  let router = useRouter();
  function navigate(path: string) {
    router.push(path);
  }
  const {
    user,
    mapUserData,
    setUserCookie,
    loginWeb3,
    setTwitterAuthCredential,
    setTwitterProvider,
  }: any = useContext(GlobalContext);
  const toast = useToast();

  async function signInWithTwitter() {
    try {
      signInWithPopup(auth, tProvider)
        .then(async (result: any) => {
          const credential = TwitterAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const secret = credential.secret;
          const TwitterAuthOBJ = {
            credential: credential,
            token: token,
            secret: secret,
          };

          if (TwitterAuthOBJ) {
            localStorage.setItem("twit", JSON.stringify(TwitterAuthOBJ));
            setTwitterAuthCredential(TwitterAuthOBJ);
          }
          const user = result.user;

          // Sign in web3auth;
          await loginWeb3(result);

          const userData = await mapUserData(user);
          const providerData = user.providerData;

          const value = { ...providerData };

          setTwitterProvider(value);
          localStorage.setItem("twit", JSON.stringify(value));
          console.log(value);
          setUserCookie(userData);
          navigate("/home");
        })
        .catch((error) => {
          // const errorCode = error.code;
          alert(error.message);
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <VStack bg="url(login-bg.svg)" minH="100vh" w="100%" overflow={"hidden"}>
      <Box
        sx={{
          backgroundImage:
            "  linear-gradient(190deg, #fa7c30 30%, rgba(0, 0, 0, 0)30%), url('/moment3.png')",
        }}
        // as="img"
        // src="/moment3.png"
        // "linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 19, 93, 0.73)), url('images/background.jpg')",

        position={"absolute"}
        left={0}
        h={["auto", "auto", "100vh"]}
        w="100%"
        opacity={0.2}
      />
      <Stack
        direction={["column", "column", "row"]}
        w="100%"
        h="100vh"
        justifyContent="space-between"
      >
        <Box w={["100%", "100%", "50%"]} pl={[0, 0, 6]}>
          <HStack w="100%" h="80px" px={[6, 6, 0]}>
            <Box as="span" display={["block", "block", "block"]}>
              <Box as="img" alt="menu" src="/logo.png" h={"60px"} w="auto" />
            </Box>
          </HStack>

          <Preview />
        </Box>

        <Box className="login-box" right={[0, 0, "15%"]}>
          <Box
            display={["none", "none", "block"]}
            as="img"
            className="log0-icon"
            src="/logo-icon.svg"
            alt="logo"
          />

          <Box className="plain-button" onClick={() => signInWithTwitter()}>
            <Box as="img" src="twitter.png" alt="twitter" /> Login with Twitter
          </Box>
        </Box>
      </Stack>
    </VStack>
  );
}

export default SignIn;
