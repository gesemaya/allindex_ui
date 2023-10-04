/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

import plugin from 'tailwindcss/plugin'

export const theme = {
  screens: {
    sm: '640px',
    md: '1024px',
    lg: '1400px',
    xl: '1600px',
    '2xl': '1600px',
  },
  hover: {
    color: '#404963',
    opacity: 0.25,
    hover: '#40496340',
  },
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F5F6FC',
    100: '#E8ECFB',
    200: '#C9D0E7',
    300: '#99A1BD',
    400: '#7C85A2',
    500: '#5E6887',
    600: '#404963',
    700: '#293249',
    800: '#141B2B',
    900: '#0E111A',
    dark: '#0E0E0E',
  },
  pink: {
    50: '#F9ECF1',
    100: '#FFD9E4',
    200: '#FBA4C0',
    300: '#FF6FA3',
    400: '#FB118E',
    500: '#C41969',
    600: '#8C0F49',
    700: '#55072A',
    800: '#350318',
    900: '#2B000B',
    vibrant: '#F51A70',
  },
  red: {
    50: '#FAECEA',
    100: '#FED5CF',
    200: '#FEA79B',
    300: '#FD766B',
    400: '#FA2B39',
    500: '#C4292F',
    600: '#891E20',
    700: '#530F0F',
    800: '#380A03',
    900: '#240800',
    vibrant: '#F14544',
  },
  yellow: {
    50: '#F6F2D5',
    100: '#DBBC19',
    200: '#BB9F13',
    300: '#A08116',
    400: '#866311',
    500: '#5D4204',
    600: '#3E2B04',
    700: '#231902',
    800: '#180F02',
    vibrant: '##FAF40A',
  },
  gold: {
    200: '#EEB317',
  },
  orange: {
    accesible: '#FF7A00',
  },
  green: {
    50: '#E3F3E6',
    100: '#BFEECA',
    200: '#76D191',
    300: '#40B66B',
    400: '#209853',
    500: '#0C522A',
    600: '#0C522A',
    700: '#053117',
    800: '#091F10',
    900: '#09130B',
    vibrant: '#5CFE9D',
  },
  blue: {
    50: '#EDEFF8',
    100: '#DEE1FF',
    200: '#ADBCFF',
    300: '#869EFF',
    400: '#4C82FB',
    500: '#1267D6',
    600: '#1D4294',
    700: '#09265E',
    800: '#0B193F',
    900: '#040E34',
    vibrant: '#587BFF',
    accessible: '#2346FD',
  },
  chain: {
    ethereum: '#627EEA',
    optimism: '#FF0420',
    polygon: '#A457FF',
  },
}

/** @type {import('tailwindcss').Config} */
const tailwindconfig = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...theme,
    },
    extend: {
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-10%)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        shimmerBackground: {
          '0%': {
            'background-position': '-1000px 0',
          },
          '100%': {
            'background-position': '1000px 0',
          },
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-20%)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          from: { opacity: 0, transform: 'translateX(2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: 'translateY(2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideRightAndFade: {
          from: { opacity: 0, transform: 'translateX(-2px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-down': 'slideDown 0.1s ease-in-out',
        shimmer: 'shimmer 2s ease-in-out infinite',
        'shimmer-background': 'shimmerBackground 10s infinite linear',
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    typography,
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      })
    }),
  ],
}

export default tailwindconfig
