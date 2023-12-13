import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Player } from '@lottiefiles/react-lottie-player';
import { RefObject, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Game = () => {
  const ref: RefObject<Player> = useRef<Player>();
  return (
    <Swiper modules={[Pagination, Navigation]} navigation pagination>
      <SwiperSlide>
        <Player
          ref={ref}
          src={
            'https://lottie.host/8cd8150f-f609-4eaa-b562-dd870e547cdc/whZTvzqlr3.json'
          }
          autoplay
          loop
          style={{ maxWidth: '300px', maxHeight: '300px' }}
          onEvent={e => {
            if (e == 'load') {
              setTimeout(() => {
                ref.current?.pause();
              }, 1500);
            }
          }}
        ></Player>
      </SwiperSlide>
      <SwiperSlide>
        <Player
          ref={ref}
          src={
            'https://lottie.host/e14f1cb3-b451-48aa-9372-33b8ad641669/TSfpHpOfvn.json'
          }
          autoplay
          loop
          style={{ maxWidth: '300px', maxHeight: '300px' }}
          onEvent={e => {
            if (e == 'load') {
              setTimeout(() => {
                ref.current?.pause();
              }, 1500);
            }
          }}
        ></Player>
      </SwiperSlide>
      <SwiperSlide>
        <Player
          ref={ref}
          src={
            'https://lottie.host/e14f1cb3-b451-48aa-9372-33b8ad641669/TSfpHpOfvn.json'
          }
          autoplay
          loop
          style={{ maxWidth: '300px', maxHeight: '300px' }}
          onEvent={e => {
            if (e == 'load') {
              setTimeout(() => {
                ref.current?.pause();
              }, 1500);
            }
          }}
        ></Player>
      </SwiperSlide>
    </Swiper>
  );
};

export default Game;
