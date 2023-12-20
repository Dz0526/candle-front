import {
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  VStack,
} from '@chakra-ui/react';

interface Props {
  onStart: () => void;
}

const Pending = ({ onStart }: Props) => {
  return (
    <Container>
      <Flex justifyContent={'center'} h={'100vh'} alignItems={'center'}>
        <VStack>
          <Heading>待機中</Heading>
          <Spinner></Spinner>
          <Button bg={'red.400'} color={'white'} onClick={() => onStart()}>
            スタート
          </Button>
        </VStack>
      </Flex>
    </Container>
  );
};

export default Pending;
