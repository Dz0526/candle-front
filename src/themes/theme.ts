import { extendTheme } from '@chakra-ui/react';

const breakpoints = {
  base: '0px',
  sm: '380px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
  '2xl': '1536px',
};

export const theme = extendTheme({
  styles: {
    global: {
      '.swipe': {
        position: 'absolute',
      },
      html: {
        overflow: 'hidden',
      },
      body: {
        overflow: 'hidden',
      },
    },
  },
  breakpoints,
});
