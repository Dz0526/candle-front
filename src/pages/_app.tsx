import { ChakraProvider } from '@chakra-ui/react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { theme } from 'themes/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
