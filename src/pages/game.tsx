import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Player } from '@lottiefiles/react-lottie-player';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Box, Progress, Text, VStack } from '@chakra-ui/react';
import { GameCandle } from 'components/GameCandle';

const Game = () => {
  const [passedTime, setPassedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassedTime(passedTime + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [passedTime]);
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
