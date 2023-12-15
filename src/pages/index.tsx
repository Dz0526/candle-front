import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Player } from '@lottiefiles/react-lottie-player';
import { RefObject, useRef } from 'react';
import { Box, Button } from '@chakra-ui/react';

const Home: NextPage = () => {
  const ref: RefObject<Player> = useRef<Player>();
  return (
    <Box position={'relative'}>
      <Button
        onClick={() => {
          ref.current?.play();
        }}
      >
        kami
      </Button>
      <Player
        ref={ref}
        src={
          'https://lottie.host/318d8b2a-15cc-421f-9913-846f4fc782a7/NOkBGoPal7.json'
        }
        style={{
          width: '40px',
          height: '40px',
          position: 'absolute',
          top: 0,
          left: 50,
        }}
      ></Player>
    </Box>
  );
};

export default Home;
