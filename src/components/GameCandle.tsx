import { Button, Text, VStack } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { RefObject, useRef } from 'react';

type Props = {
  isLit: boolean;
  ignitedBy: string;
  putOut: () => void;
};

export const GameCandle = (props: Props) => {
  const ref = useRef<Player>() as RefObject<Player>;

  return (
    <>
      <VStack>
        {props.isLit ? (
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
        {props.isLit && (
          <Text fontSize={'larger'}>{props.ignitedBy}に灯してもらった</Text>
        )}
      </VStack>
      {/* {props.isLit && (
        <Button
          bgColor={'lightBlue'}
          color={'white'}
          onClick={() => props.putOut()}
        >
          消す
        </Button>
      )} */}
    </>
  );
};
