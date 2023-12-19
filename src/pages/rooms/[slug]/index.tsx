import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Player } from '@lottiefiles/react-lottie-player';
import { useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  Box,
  Container,
  Flex,
  Heading,
  Progress,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { GameCandle } from 'components/GameCandle';
import { useRouter } from 'next/router';
import { Button } from 'components/common/Button';

const Game = () => {
  const [passedTime, setPassedTime] = useState(0);
  const [isPending, setIsPending] = useState(true);
  const socket = useRef<WebSocket>();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const slug = router.query.slug;
    socket.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_ORIGIN}`);
    socket.current.onopen = () => {
      socket.current?.send(JSON.stringify({ topic: slug }));
    };
    socket.current.onmessage = msg => {
      if (msg.data == 'start') {
        setIsPending(false);
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
      socket.current.send(JSON.stringify({ topic: slug, message: 'start' }));
      setIsPending(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPassedTime(passedTime + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [passedTime]);

  if (isPending) {
    return (
      <Container>
        <Flex justifyContent={'center'} h={'100vh'} alignItems={'center'}>
          <VStack>
            <Heading>待機中</Heading>
            <Spinner></Spinner>
            <Button bg={'red.400'} color={'white'} onClick={() => start()}>
              スタート
            </Button>
          </VStack>
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
        >
          <SwiperSlide>
            <VStack>
              <Text>トーチ</Text>
              <Player
                src={
                  //'https://lottie.host/3ae91b29-270b-49c6-b0bb-c3ee72fd12b4/MxgxWURHkH.json'
                  'https://lottie.host/7966f179-cf56-4f7c-a817-b52fc3e1a50f/JQUCTVGjFJ.json'
                }
                autoplay
                loop
                style={{ maxWidth: '300px', maxHeight: '300px' }}
              ></Player>
            </VStack>
          </SwiperSlide>
          <SwiperSlide>
            <VStack>
              <Text>ONE PIEACE好きに灯してもらうキャンドル</Text>
              <GameCandle />
            </VStack>
          </SwiperSlide>
          <SwiperSlide>
            <VStack>
              <Text>Trance好きに灯してもらうキャンドル</Text>
              <GameCandle />
            </VStack>
          </SwiperSlide>
        </Swiper>
      </Box>
    </>
  );
};

export default Game;
