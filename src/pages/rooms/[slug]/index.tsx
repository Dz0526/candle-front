import { Box, Button, Progress, Text, VStack } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
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
          socket.current?.send(
            JSON.stringify({
              topic: router.query.slug,
              message: JSON.stringify({
                type: 'fire_response',
                from: router.query.user_id,
                to: message.from,
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
      if (pageIndex == 0) {
        return;
      }
      if (socket.current) {
        const decodedId = message.split(',').join('');
        socket.current.send(
          JSON.stringify({
            topic: router.query.slug,
            message: JSON.stringify({
              type: 'fire_request',
              from: router.query.user_id,
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

  if (isPending) {
    return <Pending onStart={() => start()}></Pending>;
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
              <Text>ONE PIEACE好きに灯してもらうキャンドル</Text>
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
