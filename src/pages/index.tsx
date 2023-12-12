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
  VStack,
} from '@chakra-ui/react';
import santaAnimation from '../../lotties/santa.json';
import type { NextPage } from 'next';
import { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const Home: NextPage = () => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    setError('ルーム作成に失敗しました');
  };

  return (
    <Container>
      <Flex alignItems={'center'} h={'100vh'}>
        <VStack spacing={8}>
          <Heading>
            <Box as='span' color='purple.800'>
              サンタさん
            </Box>
            には
            <br />
            <Box as='span'>騙されない</Box>
          </Heading>
          <Box w={'50%'}>
            <Player
              src={
                'https://lottie.host/93c0ce59-6b5d-451e-a8a2-694b6e403b6a/VMYQN5ZkF4.json'
              }
              autoplay
              loop
            />
          </Box>

          <Box border='1px' borderRadius='lg' borderColor='gray.200' p={4}>
            <form
              onSubmit={e => {
                e.preventDefault();
                onSubmit();
              }}
            >
              <VStack>
                <FormControl isInvalid={!!error}>
                  <FormLabel htmlFor='room_id'>ルームID</FormLabel>
                  <Input
                    id='room_id'
                    type='text'
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                  ></Input>
                  {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </FormControl>
                <Button type='submit' bg={'red.400'} color={'white'} w='100%'>
                  ルーム作成
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Flex>
    </Container>
  );
};

export default Home;
