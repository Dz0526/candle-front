import {
  Box,
  Button,
  Container,
  Flex,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useQuery } from '@tanstack/react-query';
import MicPermission from 'components/Game/MicPermission';
import Pending from 'components/Game/Pending';
import { GameCandle } from 'components/GameCandle';
import { SonicCoder, SonicServer, SonicSocket } from 'lib/sonicnet';
import { useRouter } from 'next/router';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

type StartResponse = {
  user_id: string;
  is_santa: boolean;
  question_id: string;
  statement: string;
};

const fetchRole = (): Promise<StartResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        user_id: '859e482e-d3e5-4b9b-a322-c0b6b7e3b4f6',
        is_santa: true,
        question_id: '1',
        statement: 'ワンピースが好きな人に灯してもらうキャンドル',
      });
    }, 1000);
  });
};

const Game = () => {
  const [passedTime, setPassedTime] = useState(0);
  const sonicServer = useRef(
    new SonicServer({
      coder: new SonicCoder({ freqMin: 4000, freqMax: 6000 }),
    }),
  );
  const sonicSocket = useRef(
    new SonicSocket({
      coder: new SonicCoder({ freqMin: 4000, freqMax: 6000 }),
    }),
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLit, setIsLit] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const socket = useRef<WebSocket>();
  const router = useRouter();
  const torchRef = useRef<Player>() as RefObject<Player>;
  const [showSanta, setShowSanta] = useState(false);

  const { isLoading, data } = useQuery<StartResponse>({
    queryKey: ['role'],
    queryFn: () => fetchRole(),
    enabled: !isPending,
  });
  useEffect(() => {
    if (data && data.is_santa) {
      setShowSanta(true);
    }
  }, [data]);

  useEffect(() => {
    if (!router.isReady) return;
    socket.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_ORIGIN}`);
    socket.current.onopen = () => {
      socket.current?.send(JSON.stringify({ topic: router.query.slug }));
    };
    socket.current.onmessage = msg => {
      const message = JSON.parse(msg.data);
      if (message.type == 'start') {
        setIsPending(false);
      }

      if (message.type == 'fire_request') {
        if ((router.query.user_id as string).startsWith(message.to)) {
          alert(message.from.nickname);
          socket.current?.send(
            JSON.stringify({
              topic: router.query.slug,
              message: JSON.stringify({
                type: 'fire_response',
                from: {
                  userId: router.query.user_id,
                  nickname: router.query.nickname,
                },
                to: message.from.userId,
              }),
            }),
          );
        }
      }

      if (message.type == 'fire_response') {
        if (message.to == router.query.user_id) {
          alert(message.from);
          setIsLit(true);
        }
      }
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [router]);

  const start = () => {
    if (socket.current) {
      const slug = router.query.slug;
      socket.current.send(
        JSON.stringify({
          topic: slug,
          message: JSON.stringify({ type: 'start' }),
        }),
      );
      setIsPending(false);
    }
  };

  const onFired = useCallback(
    (message: string) => {
      if (pageIndex == 0 || isLit) {
        return;
      }
      if (socket.current) {
        const decodedId = message.split(',').join('');
        socket.current.send(
          JSON.stringify({
            topic: router.query.slug,
            message: JSON.stringify({
              type: 'fire_request',
              from: {
                userId: router.query.user_id,
                nickname: router.query.nickname,
              },
              to: decodedId,
            }),
          }),
        );
      }
    },
    [pageIndex, router.query.slug, router.query.user_id],
  );

  useEffect(() => {
    sonicServer.current.onMessage(onFired);
    const interval = setInterval(() => sonicServer.current.loop(), 1);
    return () => clearInterval(interval);
  }, [onFired, sonicServer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassedTime(passedTime + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [passedTime]);

  useEffect(() => {
    sonicServer.current.onMessage(onFired);
    const interval = setInterval(() => sonicServer.current.loop(), 1);
    return () => clearInterval(interval);
  }, [onFired, sonicServer]);

  if (!hasPermission) {
    return (
      <MicPermission
        onClick={async () => {
          await sonicServer.current.micSetup();
          sonicSocket.current.setup();
          if (
            sonicServer.current.hasMicPermission &&
            sonicSocket.current.hasAudioAccess
          ) {
            setHasPermission(true);
          }
        }}
      ></MicPermission>
    );
  }

  if (isPending || isLoading || !data) {
    return <Pending onStart={() => start()}></Pending>;
  }

  if (showSanta) {
    return (
      <Container>
        <Flex>
          <Box>
            <Player
              src={
                'https://lottie.host/93c0ce59-6b5d-451e-a8a2-694b6e403b6a/VMYQN5ZkF4.json'
              }
            />
          </Box>
        </Flex>
      </Container>
    );
  }

  return (
    <>
      <Progress value={passedTime <= 100 ? 100 - passedTime : 0} />

      <Box display={'flex'} height={'100%'} alignItems={'center'}>
        <Swiper
          modules={[Pagination, Navigation]}
          navigation
          pagination
          style={{ height: '65%' }}
          onSlideChange={(swiper: SwiperType) => {
            setPageIndex(swiper.activeIndex);
          }}
        >
          <SwiperSlide>
            <VStack>
              <Text>トーチ</Text>
              <Player
                ref={torchRef}
                src={
                  //'https://lottie.host/3ae91b29-270b-49c6-b0bb-c3ee72fd12b4/MxgxWURHkH.json'
                  'https://lottie.host/7966f179-cf56-4f7c-a817-b52fc3e1a50f/JQUCTVGjFJ.json'
                }
                // autoplay
                // loop
                style={{ maxWidth: '300px', maxHeight: '300px' }}
              ></Player>
              <Button
                onClick={() => {
                  if (router.query.user_id) {
                    sonicSocket.current.send(
                      (router.query.user_id as string)
                        .slice(0, 8)
                        .split('')
                        .join(','),
                    );
                  }
                }}
              >
                灯す
              </Button>
            </VStack>
          </SwiperSlide>
          <SwiperSlide>
            <VStack>
              <Text>{data.statement}</Text>
              <GameCandle isLit={isLit} />
            </VStack>
          </SwiperSlide>
          {/* <SwiperSlide>
            <VStack>
              <Text>Trance好きに灯してもらうキャンドル</Text>
              <GameCandle />
            </VStack>
          </SwiperSlide> */}
        </Swiper>
      </Box>
    </>
  );
};

export default Game;
