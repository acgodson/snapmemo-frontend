import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  HStack,
  Stack,
  VStack,
  Text,
  Avatar,
  Button,
  Tooltip,
  useDisclosure,
  Slide,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  Tabs,
  Input,
  useToast,
} from "@chakra-ui/react";
import NavBar from "components/navbar";
import MenuSection from "components/menusection";
import Camera from "components/camera";
import { Web3Storage } from "web3.storage";
import bs58 from "bs58";
import { GlobalContext } from "contexts/contexts";

function HomePage() {
  const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
  const [closeSend, setCloseSend] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [opened, setOpened] = useState(false);
  const [image, setImage] = useState<any>();
  const [messages, showMessage] = useState<any>();
  const { user, twitterAuthCredential, createAsset, twitterProvider }: any =
    useContext(GlobalContext);
  const [title, setTitle] = useState<any>();
  const [caption, setCaption] = useState<any>();
  const [fetching, setFetching] = useState(false);

  //   const [files, setFiles] = useState([]);
  const fileRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = fileRef.current.files[0];
    setImage(imageSrc);
    console.log(imageSrc);
  }, [fileRef]);

  const convertIpfsCidV0ToByte32 = (cid: string) => {
    let hex = `${bs58.decode(cid).slice(2).toString()}`;
    let base64 = `${bs58.decode(cid).slice(2).toString()}`;
    console.log("CID Hash Converted to hex: ", hex);

    const buffer = Buffer.from(bs58.decode(cid).slice(2).toString(), "base64");
    console.log("CID Hash Converted to Base64: ", base64);
    const volBytes = buffer.length;
    console.log(
      "CID Hash Bytes volume is: ",
      `${volBytes} bytes, OK for ASA MetaDataHash field!`
    );

    return { base64, hex, buffer };
  };

  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwNDFiQzBlMDdhQUM0ZDQyNGNiRmZEMjBkNTQzQTIyNjQ1RmRkNTgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc5OTQxMDkzNTQsIm5hbWUiOiJzbmFwbWVtbyJ9.hSY_F8uPdPau-izegDVZ5P62H7Z1l_Toh1EZSQG7ueg";

  const accessToken = twitterAuthCredential ? twitterAuthCredential.token : "";
  const accessSecret = twitterAuthCredential
    ? twitterAuthCredential.secret
    : "";

  async function pushTweet(text: string) {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        text: text,
        accessToken: accessToken,
        accessSecret: accessSecret,
      });

      var requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      fetch("https://snapmemo.herokuapp.com/tweet", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    } catch (e) {
      console.log(e);
    }
  }

  const toast = useToast();

  async function handleSubmit() {
    setFetching(true);

    const client = new Web3Storage({ token });

    const files = [new File([image], `${user.id}.jpg`)];
    const cid = await client.put(files, {
      wrapWithDirectory: false,
    });

    console.log("file stored with cid:", cid);

    ///Creating NFT Image

    let integrity = convertIpfsCidV0ToByte32(cid);

    const metadataObj = {
      name: title,
      description: caption,
      image: `ipfs://${cid}`,
      image_integrity: `sha256-${integrity.base64}`,
      image_mimetype: "image/png",
      external_url: `https://dweb.link/ipfs/${cid}`,
      properties: {
        file_url: "arc3-asa",
        file_url_integrity: "sha256-48DEQpj8HBSa...",
        file_url_mimetype: "image/png",
      },
    };

    //Upload NFT metadata to a folder
    const blob = new Blob([JSON.stringify(metadataObj)], {
      type: "application/json",
    });

    const metaFile = new File([blob], "metadata.json");
    const mCid = await client.put([metaFile], {
      wrapWithDirectory: true,
    });

    console.log(mCid);

    if (mCid) {
      console.log(mCid);
      const nID = await createAsset(mCid);
      console.log("Asset successfully created");
      setFetching(false);
      setCaption("");
      setTitle("");

      toast({
        title: "Image Shared Successfully",

        status: "success",
        duration: 9000,
        isClosable: true,
      });

      const chec = "New NFT photo" + `https://dweb.link/ipfs/${cid}`;

      pushTweet(chec);
    }
  }

  useEffect(() => {
    console.log(user);
  }, []);

  function showLink(url: string) {
    showMessage(
      <Box as="span">
        &gt; 🔗 <a href={url}>{url}</a>
      </Box>
    );
  }

  useEffect(() => {
    if (!isOpen) {
      onToggle();
    }
  }, [onToggle, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCloseSend(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (openModal) {
      setOpened(true);
    }
  }, [openModal]);

  useEffect(() => {
    console.log("hsi not", twitterProvider);
  });

  function closeModal() {
    setOpened(false);
    setOpenModal(false);
  }

  return (
    <>
      <VStack bg="url(home-bg.svg)" h="100vh" w="100%" px={6}>
        {closeSend && (
          <NavBar
            onSend={() => {
              setCloseSend(false);
            }}
          />
        )}

        <HStack>
          <Box
            as="img"
            w="81.97px"
            h="80.29px"
            src="/logo-icon.svg"
            alt="logo"
          />

          {user && (
            <Avatar
              src={twitterProvider ? `${twitterProvider.photoURL}` : null}
              color="whitesmoke"
              w="81.97px"
              h="80.29px"
            />
          )}
        </HStack>

        <HStack>
          <Box as="img" src="twitter.png" alt="twitter" />
          <Text className="username" fontSize={["lg", "lg", "xl"]}>
            {twitterProvider ? twitterProvider.displayName : ""}
          </Text>
        </HStack>

        <VStack>
          <Text
            className="title"
            textAlign="center"
            fontSize={["35px", "35px", "48px"]}
          >
            Share your moments
          </Text>
          <Text
            className="subtitle"
            color="#EEEEEE"
            textAlign="center"
            fontSize={["18px", "18px", "24px"]}
          >
            Create and Tweet short links for your NFT photos in one click
          </Text>

          <Stack
            direction={["column", "column", "row"]}
            justifyContent="center"
            py={6}
          >
            <Tooltip
              hasArrow
              label="Upload new image asset online"
              bg="gray.300"
              color="black"
            >
              <Button
                className="home-button"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                <Box as="img" src="/upload.png"></Box>
                Upload
              </Button>
            </Tooltip>
            <Tooltip
              hasArrow
              label="Open gallery to relive existing
          photos"
              bg="gray.300"
              color="black"
            >
              <Button className="home-button">
                <Box as="img" src="/open-gallery.png"></Box>
                Open Gallery
              </Button>
            </Tooltip>
          </Stack>
        </VStack>

        {!closeSend && (
          <Slide direction="right" in={isOpen} style={{ zIndex: 10 }}>
            <MenuSection onToggle={onToggle} />
          </Slide>
        )}

        <Modal isOpen={opened} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Photo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <>
                <Box
                  w="100%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Tabs>
                    <TabList>
                      <Tab>Camera</Tab>
                      <Tab>Device</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        <Camera />
                      </TabPanel>
                      <TabPanel>
                        <>
                          {messages && <Box as="div">{messages}</Box>}

                          <Input
                            className="hidden"
                            type="file"
                            id="file-input"
                            accept=".jpeg,.jpg,.png,.gif,image/*"
                            ref={fileRef}
                            onChange={(e) => capture()}
                          />

                          {image && (
                            <Button
                              alignSelf="center"
                              my={6}
                              colorScheme="blue"
                              onClick={() => handleSubmit()}
                            >
                              Continue
                            </Button>
                          )}
                        </>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </>
  );
}

export default HomePage;
