import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { NextPage } from 'next';
import { useState } from 'react';

const ResultPage: NextPage = () => {
  const [isWindVisiable, setIsWindVisiable] = useState(false);
  const [isSnowmanVisiable, setIsSnowmanVisiable] = useState(false);
  const [lit, setLit] = useState(true);

  const putOut = () => {
    setIsWindVisiable(true);
    setTimeout(() => setIsWindVisiable(false), 1200);
    setTimeout(() => setLit(false), 1000);
    setTimeout(() => setIsSnowmanVisiable(true), 2000);
  };
  return (
    <Container>
      <Flex alignItems={'center'} h={'100vh'} justifyContent={'center'}>
        <VStack>
          <Heading>結果発表</Heading>
          <Box position={'relative'}>
            <Player
              src={
                'https://lottie.host/e0b89049-4fc5-4c83-b4e6-a1576429f198/3Ahs8vnjFJ.json'
              }
              autoplay
              loop
              style={{
                maxWidth: '150px',
                maxHeight: '150px',
                zIndex: 2,
                position: 'absolute',
                transition: '1s',
                opacity: isWindVisiable ? 1 : 0,
              }}
            ></Player>
            <Player
              src={
                'https://lottie.host/e14f1cb3-b451-48aa-9372-33b8ad641669/TSfpHpOfvn.json'
              }
              autoplay
              loop
              style={{
                maxWidth: '300px',
                maxHeight: '300px',
                transition: '1s',
                opacity: lit ? 1 : 0,
              }}
            ></Player>

            <Player
              src={
                'https://lottie.host/b3294f49-3e15-4363-b72d-9d12a869b4fa/ySy9Bz0IQa.json'
              }
              autoplay
              loop
              style={{
                maxWidth: '300px',
                maxHeight: '300px',
                transition: '2s',
                opacity: isSnowmanVisiable ? 1 : 0,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            ></Player>
          </Box>
          <Text>○○に灯してもらったキャンドル</Text>

          <Button
            bgColor={'lightBlue'}
            color={'white'}
            onClick={() => putOut()}
            w={'100%'}
          >
            結果発表
          </Button>
        </VStack>
      </Flex>
    </Container>
  );
};

export default ResultPage;
