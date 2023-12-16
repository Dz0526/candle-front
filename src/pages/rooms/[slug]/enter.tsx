import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  keyframes,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Player } from '@lottiefiles/react-lottie-player';
import TinderCard from 'react-tinder-card';
import { motion } from 'framer-motion';
import { createRef, useRef, useState } from 'react';

type Question = {
  id: number;
  content: string;
};

type Answer = {
  question_id: number;
  answer: boolean;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    content: '進撃の巨人が好きですか',
  },
  {
    id: 2,
    content: '中日ドラゴンズファンですか',
  },
  {
    id: 3,
    content: '呪術廻戦を観ていますか',
  },
  {
    id: 4,
    content: 'LE SSERAFIMを知っていますか',
  },
  {
    id: 5,
    content: '海外旅行に行ったことがありますか',
  },
  {
    id: 6,
    content: 'ONE PIECEに詳しいですか',
  },
  {
    id: 7,
    content: '海外旅行に行ったことがありますか',
  },
];

const animationKeyframes = keyframes`
0% {transform: translate(0)}
50% {transform: translate(-150px)}
100% {transform: translate(0)}
`;
const animation = `${animationKeyframes} 4s linear infinite`;

const EnterPage: NextPage = () => {
  const [swipedNum, setSwipedNum] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const router = useRouter();

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
      <Flex justifyContent={'center'}>
        <VStack spacing={8} zIndex={0} mt={40} mb={20}>
          <Heading>ゲームに参加するために質問に答えよう</Heading>
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
                <Box w={'90vw'} maxW={'260px'} height={'300px'}>
                  {QUESTIONS.map((question, index) => (
                    <TinderCard
                      className='swipe'
                      key={question.id}
                      preventSwipe={['up', 'down']}
                      onSwipe={async dir => {
                        setSwipedNum(swipedNum + 1);
                        if (dir == 'right') {
                          setAnswers([
                            ...answers,
                            { question_id: question.id, answer: true },
                          ]);
                        }
                        if (dir == 'left') {
                          setAnswers([
                            ...answers,
                            { question_id: question.id, answer: false },
                          ]);
                        }
                      }}
                    >
                      <Box
                        position={'relative'}
                        //bgGradient={'linear(to-r, green.200, pink.500)'}
                        bgColor={'white'}
                        width={'80vw'}
                        maxW={'260px'}
                        height={'300px'}
                        boxShadow={'lg'}
                        borderRadius={'20px'}
                      >
                        <VStack justifyContent={'center'} height={'100%'}>
                          <Text
                            //color={'white'}
                            fontSize={'3xl'}
                            textAlign={'center'}
                          >
                            {question.content}
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
                isLoading={QUESTIONS.length > swipedNum}
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
