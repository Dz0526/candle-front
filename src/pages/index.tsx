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
import type { NextPage } from 'next';
import { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { client } from 'utils/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';

type CreateRoomInput = {
  room_id: string;
};

type CreateRoomResponse = {
  room_id: string;
};

const Home: NextPage = () => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (input: CreateRoomInput) =>
      client.post<CreateRoomResponse>('/room', input).then(res => res.data),
    onSuccess: data => {
      router.push(`/rooms/${data.room_id}/share`);
    },
    onError: error => {
      // toast
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response?.status == 409
      ) {
        setError(
          'ルームIDがすでに使用されています．別のルームIDを試してください．',
        );
        return;
      }
      setError('ルーム作成に失敗しました');
    },
  });

  const onSubmit = () => {
    mutation.mutate({ room_id: roomId });
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
