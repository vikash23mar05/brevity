import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // CSS variable set in layout.tsx via next/font
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        blue: {
          DEFAULT: '#2233ee',
          dark: '#1122cc',
        },
      },
    },
  },
  plugins: [],
};

export default config;
