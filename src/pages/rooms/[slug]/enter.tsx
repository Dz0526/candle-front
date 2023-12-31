import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  keyframes,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Player } from '@lottiefiles/react-lottie-player';
import TinderCard from 'react-tinder-card';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { client } from 'utils/client';

type QuestionResponse = {
  questions: { question_id: number; statement: string }[];
};

type Answer = {
  question_id: number;
  answer: boolean;
};

type EnterRoomInput = {
  nickname: string;
  answers: { question_id: number; answer: boolean }[];
};

type EnterRoomResponse = {
  user_id: string;
};

const animationKeyframes = keyframes`
0% {transform: translate(0)}
50% {transform: translate(-120px)}
100% {transform: translate(0)}
`;
const animation = `${animationKeyframes} 4s linear infinite`;

const EnterPage: NextPage = () => {
  const [swipedNum, setSwipedNum] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { isLoading, data } = useQuery<QuestionResponse, AxiosError>({
    queryKey: ['questions'],
    queryFn: () =>
      client.get<QuestionResponse>('/questions').then(res => res.data),
  });
  const mutation = useMutation({
    mutationFn: (input: EnterRoomInput) =>
      client
        .post<EnterRoomResponse>(`/room/${router.query.slug}`, input)
        .then(res => res.data),
    onSuccess: data => {
      router.push(
        `/rooms/${router.query.slug}?user_id=${data.user_id}&nickname=${nickname}`,
      );
    },
    onError: error => {
      // toast
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response?.status == 404
      ) {
        setError('存在しないルームです');
        return;
      }
      setError('入室に失敗しました。');
    },
  });

  const onSubmit = () => {
    mutation.mutate({
      nickname: nickname,
      answers: answers,
    });
  };

  return (
    <Container>
      <Box position={'absolute'} transform={'translateY(-32%)'}>
        <Player
          src={
            'https://lottie.host/3539fdea-7ab2-4951-b63d-e00937106246/qZAe3rbLfO.json'
          }
          autoplay
          loop
        />
      </Box>
      <Flex justifyContent={'center'} maxH={{ base: '600px' }}>
        <VStack
          spacing={6}
          zIndex={0}
          mt={{ base: 20, sm: 20 }}
          mb={{ base: 0, sm: 20 }}
        >
          <Heading fontSize={'lg'}>
            ゲームに参加するために質問に答えよう
          </Heading>
          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <VStack spacing={6}>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel htmlFor='name'>ユーザー名</FormLabel>
                  <Input
                    id='name'
                    required
                    onChange={e => setNickname(e.target.value)}
                  ></Input>
                </FormControl>
                <Box
                  w={'90vw'}
                  maxW={{ base: '200px', sm: '220px' }}
                  height={{ base: '220px', sm: '240px' }}
                >
                  {!isLoading &&
                    data &&
                    data.questions.map((question, index) => (
                      <TinderCard
                        className='swipe'
                        key={question.question_id}
                        preventSwipe={['up', 'down']}
                        onSwipe={async dir => {
                          setSwipedNum(swipedNum + 1);
                          if (dir == 'right') {
                            setAnswers([
                              ...answers,
                              {
                                question_id: question.question_id,
                                answer: true,
                              },
                            ]);
                          }
                          if (dir == 'left') {
                            setAnswers([
                              ...answers,
                              {
                                question_id: question.question_id,
                                answer: false,
                              },
                            ]);
                          }
                        }}
                      >
                        <Box
                          position={'relative'}
                          //bgGradient={'linear(to-r, green.200, pink.500)'}
                          bgColor={'white'}
                          width={'80vw'}
                          maxW={{ base: '200px', sm: '220px' }}
                          height={{ base: '220px', sm: '240px' }}
                          boxShadow={'lg'}
                          borderRadius={'20px'}
                        >
                          <VStack justifyContent={'center'} height={'100%'}>
                            <Text
                              //color={'white'}
                              fontSize={{ base: '2xl', sm: '3xl' }}
                              textAlign={'center'}
                            >
                              {question.statement}
                            </Text>
                          </VStack>
                          <Box
                            position={'absolute'}
                            top={0}
                            right={0}
                            as={motion.div}
                            animation={animation}
                          >
                            <Player
                              src={
                                'https://lottie.host/5b7e9314-aef0-4780-8a41-363bb1ff6385/q2Xkv4bc0H.json'
                              }
                              autoplay
                              loop
                              style={{
                                width: '100px',
                                height: '100px',
                              }}
                            />
                          </Box>
                        </Box>
                      </TinderCard>
                    ))}
                </Box>
                <Text>スワイプ！Yesは右へ Noは左へ</Text>
              </VStack>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}

              <Button
                bg={'red.400'}
                color='white'
                type='submit'
                w='100%'
                isLoading={
                  (data ? data?.questions.length > swipedNum : true) ||
                  nickname.length == 0
                }
                loadingText={'参加する'}
                spinner={<></>}
              >
                参加する
              </Button>
            </VStack>
          </form>
        </VStack>
      </Flex>
    </Container>
  );
};

export default EnterPage;
