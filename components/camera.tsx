import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import Webcam from "react-webcam";

const cameraWidth = 720;
const cameraHeight = 720;
const aspectRatio = cameraWidth / cameraHeight;

const videoConstraints = {
  width: {
    min: cameraWidth,
  },
  height: {
    min: cameraHeight,
  },
  aspectRatio,
};

const Camera = () => {
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);
  const [image, setImage] = useState<any | null>();

  let src = image;

  useEffect(() => {
    console.log(image);
  }, [image]);

  return (
    <>
      <Box as="div" display="flex" flexDirection="column" alignItems="center">
        {!image ? (
          <Webcam
            audio={false}
            videoConstraints={videoConstraints}
            width={cameraWidth}
            height={cameraHeight}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
        ) : (
          <Box
            as="img"
            src={image}
            width="auto"
            height="200px"
            borderRadius="10px"
          />
        )}

        <Box display="flex" justifyContent="space-around" alignItems="center">
          {!image && (
            <Button
              my={6}
              colorScheme="blue"
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
            >
              Capture
            </Button>
          )}

          {image && (
            <Button
              my={6}
              mr={3}
              colorScheme="red"
              onClick={() => setImage(null)}
            >
              Retake
            </Button>
          )}

          {image && (
            <Button
              my={6}
              colorScheme="blue"
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Camera;
