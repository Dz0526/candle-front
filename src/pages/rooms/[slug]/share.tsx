import { Container, Flex, Text, VStack, useToast } from '@chakra-ui/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Button } from 'components/common/Button';
import { useRouter } from 'next/router';

const SharePage = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const toast = useToast();
  return (
    <Container>
      <Flex alignItems={'center'} justifyContent={'center'} h={'100vh'}>
        <VStack>
          <Text fontSize={'2xl'}>友達もゲームに誘おう！</Text>
          <Player
            src={
              'https://lottie.host/040ea6b8-e209-4330-8832-a97c7fdd6fcb/xvlJhdPLUV.json'
            }
            autoplay
            loop
            style={{ width: '200px', height: '200px' }}
          />
          <VStack spacing={'20px'}>
            <Button
              onClick={() => {
                // https環境で正しく動作
                navigator.clipboard
                  .writeText(`https://localhost:3001/rooms/${slug}/share`)
                  .then(() => {
                    toast({
                      title: 'クリップボードにURLがコピーされました',
                      description: 'LINEなどで友達にシェアしよう！',
                      status: 'success',
                      duration: 9000,
                      isClosable: true,
                    });
                  });
              }}
              bg={'red.400'}
              color={'white'}
              w={'100%'}
            >
              URLをシェア
            </Button>
            <Button
              onClick={() => {
                router.push(`/rooms/${slug}/enter`);
              }}
              bg={'red.400'}
              color={'white'}
              w={'100%'}
            >
              部屋に参加
            </Button>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
};

export default SharePage;
