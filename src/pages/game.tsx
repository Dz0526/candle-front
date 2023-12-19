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
import { GameCandle } from 'components/GameCandle';
import { SonicServer, SonicSocket } from 'lib/sonicnet';
import { useCallback, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Game = () => {
  const [passedTime, setPassedTime] = useState(0);
  const [sonicServer, setSonicServer] = useState(new SonicServer());
  const [sonicSocket, setSonicSocket] = useState(new SonicSocket());
  const [pageIndex, setPageIndex] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLit, setIsLit] = useState(false);

  const onFired = useCallback(
    (message: string) => {
      if (pageIndex != 0) {
        setIsLit(true);
      }
    },
    [pageIndex],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPassedTime(passedTime + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [passedTime]);

  useEffect(() => {
    sonicServer.onMessage(onFired);
    const interval = setInterval(() => sonicServer.loop(), 1);
    return () => clearInterval(interval);
  }, [pageIndex]);

  if (!hasPermission) {
    return (
      <Container>
        <Flex alignItems={'center'} h={'100vh'}>
          <VStack>
            <Text as={'p'} fontSize={'xx-large'}>
              マイクの利用を許可してゲームを開始しよう
            </Text>
            <Button
              w='100%'
              onClick={async () => {
                await sonicServer.micSetup();
                sonicSocket.setup();
                if (
                  sonicServer.hasMicPermission &&
                  sonicSocket.hasAudioAccess
                ) {
                  setHasPermission(true);
                }
              }}
            >
              許可
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
          onSlideChange={swiper => {
            setPageIndex(swiper.activeIndex);
          }}
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
              <Button
                onClick={() => {
                  setTimeout(() => sonicSocket.send('myuserid'), 1000);
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
