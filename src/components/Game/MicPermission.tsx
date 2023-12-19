import { Button, Container, Flex, Text, VStack } from '@chakra-ui/react';

interface Props {
  onClick: () => void;
}

const MicPermission = (props: Props) => {
  return (
    <Container>
      <Flex alignItems={'center'} h={'100vh'}>
        <VStack>
          <Text as={'p'} fontSize={'xx-large'}>
            マイクの利用を許可してゲームを開始しよう
          </Text>
          <Button
            w='100%'
            onClick={() => {
              props.onClick();
            }}
          >
            許可
          </Button>
        </VStack>
      </Flex>
    </Container>
  );
};

export default MicPermission;
