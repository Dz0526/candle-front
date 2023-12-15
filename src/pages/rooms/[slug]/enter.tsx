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
  VStack,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Player } from '@lottiefiles/react-lottie-player';

type Question = {
  id: number;
  content: string;
};

type Answer = {
  id: number;
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

const EnterPage: NextPage = () => {
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
                {QUESTIONS.map((question, index) => (
                  <FormControl key={question.id}>
                    <FormLabel>
                      <Box as='span' fontWeight={'bold'}>
                        Q{index + 1}.
                      </Box>
                      <Box as='span' pl={1}>
                        {question.content}
                      </Box>
                    </FormLabel>
                    <RadioGroup defaultValue='true'>
                      <Stack direction='row'>
                        <Radio value='true'>はい</Radio>
                        <Radio value='false'>いいえ</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                ))}
              </VStack>

              <Button bg={'red.400'} color='white' type='submit' w='100%'>
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
