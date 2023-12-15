import { Box, ButtonProps, Button as CButton } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useRef, useState } from 'react';

type Props = Omit<ButtonProps, 'zIndex' | 'onClickCapture'>;

export const Button = (props: Props) => {
  const ref = useRef<Player>();
  const ref2 = useRef<Player>();
  const [zIndex, setZIndex] = useState(10);
  return (
    <Box position={'relative'} w={props.w ?? 'auto'}>
      <CButton
        onClickCapture={() => {
          setZIndex(0);
          ref.current?.play();
          ref2.current?.play();
          setTimeout(() => {
            setZIndex(10);
          }, 500);
        }}
        zIndex={zIndex}
        {...props}
      >
        {props.children}
      </CButton>
      <Player
        ref={ref}
        src={
          'https://lottie.host/318d8b2a-15cc-421f-9913-846f4fc782a7/NOkBGoPal7.json'
        }
        style={{
          width: '50px',
          height: '50px',
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 0,
        }}
      />
      <Player
        ref={ref2}
        src={
          'https://lottie.host/318d8b2a-15cc-421f-9913-846f4fc782a7/NOkBGoPal7.json'
        }
        style={{
          width: '50px',
          height: '50px',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />
    </Box>
  );
};
