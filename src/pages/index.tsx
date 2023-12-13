import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Player } from '@lottiefiles/react-lottie-player';
import { RefObject, useRef } from 'react';

const Home: NextPage = () => {
  const ref: RefObject<Player> = useRef<Player>();
  return (
    <Player
      ref={ref}
      src={
        'https://lottie.host/8cd8150f-f609-4eaa-b562-dd870e547cdc/whZTvzqlr3.json'
      }
      autoplay
      style={{ width: '300px', height: '300px' }}
      onEvent={e => {
        if (e == 'load') {
          setTimeout(() => {
            ref.current?.pause();
          }, 1500);
        }
      }}
    ></Player>
  );
};

export default Home;
