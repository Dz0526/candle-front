import { Player } from '@lottiefiles/react-lottie-player';
import { RefObject, useRef, useState } from 'react';
import { Button } from './common/Button';

type Props = {
  isLit: boolean;
};

export const GameCandle = () => {
  const ref = useRef<Player>() as RefObject<Player>;
  const [isLit, setIsLit] = useState(false);
  return (
    <>
      {isLit ? (
        <Player
          src={
            'https://lottie.host/e14f1cb3-b451-48aa-9372-33b8ad641669/TSfpHpOfvn.json'
          }
          autoplay
          loop
          style={{ maxWidth: '300px', maxHeight: '300px' }}
        ></Player>
      ) : (
        <Player
          ref={ref}
          src={
            'https://lottie.host/6823421f-5153-4d98-ae82-d18c096e90c7/dmIye8Yuaz.json'
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
      )}
      <Button
        bgColor={'lightBlue'}
        color={'white'}
        onClick={() => setIsLit(!isLit)}
      >
        {isLit ? '消す' : '灯す'}
      </Button>
    </>
  );
};
