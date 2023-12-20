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
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { RefObject, useCallback, useRef, useState } from 'react';
import { client } from 'utils/client';

type ResultResponse = {
  result: boolean;
  is_igniter_santa: boolean;
  is_player_santa: boolean;
  ignited_by: string;
};

const ResultPage: NextPage = () => {
  const [isWindVisiable, setIsWindVisiable] = useState(false);
  const [isSnowmanVisiable, setIsSnowmanVisiable] = useState(false);
  const [lit, setLit] = useState(true);
  const [displayResult, setDisplayResult] = useState(false);

  const winAnimationRef = useRef<Player>() as RefObject<Player>;
  const loseAnimationRef = useRef<Player>() as RefObject<Player>;

  const router = useRouter();
  const user_id = router.query.user_id;
  const room_id = router.query.room_id;
  const { isLoading, data, isError } = useQuery<ResultResponse, AxiosError>({
    queryKey: ['results'],
    queryFn: () =>
      client
        .get<ResultResponse>(`/room/${room_id}/result/${user_id}`)
        .then(res => res.data),
    enabled: !!user_id && !!room_id,
  });

  const putOut = useCallback(() => {
    if (!data) return;
    if (data.is_igniter_santa) {
      setIsWindVisiable(true);
      setTimeout(() => setIsWindVisiable(false), 1200);
      setTimeout(() => setLit(false), 1000);
      setTimeout(() => setIsSnowmanVisiable(true), 2000);
      setTimeout(() => {
        setDisplayResult(true);
        data.result
          ? winAnimationRef.current?.play()
          : loseAnimationRef.current?.play();
      }, 2000);
    }
    setTimeout(() => {
      setDisplayResult(true);
      data.result
        ? winAnimationRef.current?.play()
        : loseAnimationRef.current?.play();
    }, 2000);
  }, [data]);

  return isError ? (
    <Container h={'100%'}>
      <VStack justifyContent={'center'} h={'100%'}>
        <Player
          src={
            'https://lottie.host/094b6c36-2b95-436e-8ffb-8c687f953e74/Pp8oPFEZ9A.json'
          }
          autoplay
          loop
        />
        <Text fontSize={'2xl'}>結果が存在していません！</Text>
      </VStack>
    </Container>
  ) : (
    <Container>
      {isLoading && data && (
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

              <VStack opacity={data.result && displayResult ? 1 : 0}>
                <Player
                  ref={winAnimationRef}
                  src={
                    'https://lottie.host/e02308a6-7a66-449a-bad0-152bca2f2cdd/GAdsWB4RRC.json'
                  }
                />
                <Text>あなたの陣営の勝利です！</Text>
              </VStack>

              <VStack opacity={data.result && displayResult ? 0 : 1}>
                <Player
                  ref={loseAnimationRef}
                  src={
                    'https://lottie.host/0f0152b3-2ab8-4f70-8841-7fd851a392c5/L5GxXpjmdj.json'
                  }
                />
                <Text>相手陣営の勝利です！</Text>
              </VStack>
            </Box>
            <Text>{data.ignited_by}に灯してもらったキャンドル</Text>

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
      )}
    </Container>
  );
};

export default ResultPage;
