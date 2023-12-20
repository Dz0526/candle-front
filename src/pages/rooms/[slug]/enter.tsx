import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
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
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { client } from 'utils/client';

type QuestionResponse = {
  questions: { question_id: number; statement: string }[];
};

type Answer = {
  question_id: number;
  answer: boolean;
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
  const router = useRouter();
  const { isLoading, data } = useQuery<QuestionResponse, AxiosError>({
    queryKey: ['questions'],
    queryFn: () =>
      client.get<QuestionResponse>('/questions').then(res => res.data),
  });

  const onSubmit = () => {
    router.push(`/rooms/${router.query.slug}`);
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
          spacing={8}
          zIndex={0}
          mt={{ base: 20, sm: 40 }}
          mb={{ base: 0, sm: 20 }}
        >
          <Heading fontSize={{ base: 'lg', sm: '2xl' }}>
            ゲームに参加するために質問に答えよう
          </Heading>
          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <VStack spacing={8}>
              <VStack spacing={8}>
                <FormControl>
                  <FormLabel htmlFor='name'>ユーザー名</FormLabel>
                  <Input id='name'></Input>
                </FormControl>
                <Box
                  w={'90vw'}
                  maxW={{ base: '200px', sm: '260px' }}
                  height={{ base: '240px', sm: '300px' }}
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
                          maxW={{ base: '200px', sm: '260px' }}
                          height={{ base: '240px', sm: '300px' }}
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

              <Button
                bg={'red.400'}
                color='white'
                type='submit'
                w='100%'
                isLoading={data ? data?.questions.length > swipedNum : true}
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
