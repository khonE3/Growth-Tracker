/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Green Hi-Tech Theme
        'tech-dark': '#0a0e0d',
        'tech-darker': '#050807',
        'tech-green': {
          50: '#e6fff9',
          100: '#c2fff0',
          200: '#85ffe0',
          300: '#42ffd0',
          400: '#00ffb3',
          500: '#00e69f',
          600: '#00b37d',
          700: '#008f65',
          800: '#007352',
          900: '#005f44',
        },
        'tech-accent': '#00ff94',
        'tech-glow': '#00ffaa',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(0, 255, 148, 0.3)',
        'glow-lg': '0 0 20px rgba(0, 255, 148, 0.4)',
        'glow-xl': '0 0 30px rgba(0, 255, 148, 0.5)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 255, 148, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 255, 148, 0.6)',
          },
        },
      },
    },
  },
  plugins: [],
}
