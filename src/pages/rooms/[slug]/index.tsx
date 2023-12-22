import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useMutation } from '@tanstack/react-query';
import MicPermission from 'components/Game/MicPermission';
import Pending from 'components/Game/Pending';
import useTimer from 'components/Game/useTimer';
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
import { client } from 'utils/client';

type StartResponse = {
  user_id: string;
  is_santa: boolean;
  question_id: string;
  question_description: string;
};

type StartInput = {
  user_id: string;
};

type ResultInput = {
  user_id: string;
  fire_user_id: string;
  question_id: number;
};

type ResultResponse = {
  fired: boolean;
};

type Igniter = {
  userId: string;
  nickname: string;
};

const Game = () => {
  const [passedTime, setPassedTime] = useState(0);
  const sonicServer = useRef(
    new SonicServer({
      coder: new SonicCoder(),
    }),
  );
  const sonicSocket = useRef(
    new SonicSocket({
      coder: new SonicCoder(),
    }),
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLit, setIsLit] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const socket = useRef<WebSocket>();
  const router = useRouter();
  const torchRef = useRef<Player>() as RefObject<Player>;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [igniter, setIgniter] = useState<Igniter>();
  const [role, setRole] = useState<StartResponse>();
  const [error, setError] = useState('');
  const { remainingTimePercentage, start: startTimer } = useTimer(300, () => {
    if (role && igniter) {
      sendResult({
        user_id: router.query.user_id as string,
        fire_user_id: igniter.userId,
        question_id: parseInt(role.question_id),
      });
    }
  });

  const { mutate: startGame } = useMutation({
    mutationFn: (input: StartInput) =>
      client
        .post<StartResponse>(`/room/${router.query.slug}/start`, input)
        .then(res => res.data),
    onSuccess: data => {
      setRole(data);
    },
    onError: error => {
      setError('エラーが発生しました。');
    },
  });
  const { mutate: sendResult } = useMutation({
    mutationFn: (input: ResultInput) =>
      client
        .post<ResultResponse>(`/room/${router.query.slug}/result`, input)
        .then(res => res.data),
    onSuccess: data => {
      router.push(
        `/rooms/${router.query.slug}/result?user_id=${router.query.user_id}`,
      );
    },
    onError: error => {
      setError('エラーが発生しました。');
    },
  });

  useEffect(() => {
    if (role) {
      onOpen();
    }
  }, [role, onOpen]);

  useEffect(() => {
    if (!isPending && router.isReady) {
      startGame({ user_id: router.query.user_id as string });
    }
  }, [isPending, startGame, router]);

  const onMessage = (msg: MessageEvent<any>) => {
    const message = JSON.parse(msg.data);
    if (message.type == 'start') {
      setIsPending(false);
      startTimer();
    }

    if (message.type == 'fire_request') {
      if ((router.query.user_id as string).startsWith(message.to)) {
        socket.current?.send(
          JSON.stringify({
            topic: router.query.slug,
            message: JSON.stringify({
              type: 'fire_response',
              from: {
                userId: router.query.user_id,
                nickname: router.query.nickname,
              },
              to: message.from.userId,
            }),
          }),
        );
        socket.current?.send(
          JSON.stringify({
            topic: router.query.slug,
            message: JSON.stringify({
              type: 'fire_response',
              from: {
                userId: router.query.user_id,
                nickname: router.query.nickname,
              },
              to: message.from.userId,
            }),
          }),
        );
        socket.current?.send(
          JSON.stringify({
            topic: router.query.slug,
            message: JSON.stringify({
              type: 'fire_response',
              from: {
                userId: router.query.user_id,
                nickname: router.query.nickname,
              },
              to: message.from.userId,
            }),
          }),
        );
      }
    }

    if (message.type == 'fire_response') {
      if (message.to == router.query.user_id) {
        setIgniter({
          nickname: message.from.nickname,
          userId: message.from.userId,
        });
        setIsLit(true);
      }
    }
  };
  useEffect(() => {
    if (!router.isReady) return;
    socket.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_ORIGIN}`);
    socket.current.onopen = () => {
      socket.current?.send(JSON.stringify({ topic: router.query.slug }));
    };
    socket.current.addEventListener('message', onMessage);
    socket.current.onmessage = msg => {
      const message = JSON.parse(msg.data);
      if (message.type == 'start') {
        setIsPending(false);
        startTimer();
      }

      if (message.type == 'fire_request') {
        if ((router.query.user_id as string).startsWith(message.to)) {
          socket.current?.send(
            JSON.stringify({
              topic: router.query.slug,
              message: JSON.stringify({
                type: 'fire_response',
                from: {
                  userId: router.query.user_id,
                  nickname: router.query.nickname,
                },
                to: message.from.userId,
              }),
            }),
          );
        }
      }

      if (message.type == 'fire_response') {
        if (message.to == router.query.user_id) {
          setIgniter({
            nickname: message.from.nickname,
            userId: message.from.userId,
          });
          setIsLit(true);
        }
      }
    };

    return () => {
      if (socket.current) {
        if (socket.current.readyState == 1) {
          socket.current.removeEventListener('message', onMessage);
          socket.current.close();
        }
      }
    };
  }, []);

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
      startTimer();
    }
  };
  const putOut = () => {
    setIsLit(false);
  };

  const onFired = useCallback(
    (message: string) => {
      if (pageIndex == 0 || isLit) {
        return;
      }
      if (socket.current) {
        const decodedId = message.split(',').join('');
        socket.current.send(
          JSON.stringify({
            topic: router.query.slug,
            message: JSON.stringify({
              type: 'fire_request',
              from: {
                userId: router.query.user_id,
                nickname: router.query.nickname,
              },
              to: decodedId,
            }),
          }),
        );
      }
    },
    [
      isLit,
      pageIndex,
      router.query.nickname,
      router.query.slug,
      router.query.user_id,
    ],
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

  if (isPending || !role) {
    return <Pending onStart={() => start()}></Pending>;
  }

  return (
    <>
      <Progress value={remainingTimePercentage} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>あなたの役職</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack p={10}>
              {role.is_santa ? (
                <Player
                  src={
                    'https://lottie.host/93c0ce59-6b5d-451e-a8a2-694b6e403b6a/VMYQN5ZkF4.json'
                  }
                />
              ) : (
                <Player
                  src={
                    'https://lottie.host/45b3da84-e875-4649-91e4-5f5a20b7eef1/ZnrEPPqgNT.json'
                  }
                />
              )}
              <Text fontSize={'xx-large'}>
                {role.is_santa ? 'サンタ' : '市民'}
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
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
                    torchRef.current?.play();
                  }
                }}
              >
                灯す
              </Button>
            </VStack>
          </SwiperSlide>
          <SwiperSlide>
            <VStack>
              <Text>
                「{role.question_description}
                」に「はい」と答えた人に灯してもらうキャンドル
              </Text>
              <GameCandle
                isLit={isLit}
                ignitedBy={igniter ? igniter.nickname : ''}
                putOut={() => putOut()}
              />
            </VStack>
          </SwiperSlide>
        </Swiper>
      </Box>
    </>
  );
};

export default Game;
