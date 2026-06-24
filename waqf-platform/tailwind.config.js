/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:  '#1F6B52',
        'primary-dark': '#174d3b',
        'primary-light': '#2d8a6a',
        secondary: '#D8B56A',
        'secondary-light': '#f0d08a',
        bg: '#F7F8F5',
        accent: '#E9F2ED',
        dark: '#1E293B',
        'waqf-green': '#1B4332',
        'waqf-gold': '#D4A017',
      },
      fontFamily: {
        arabic: ['Tajawal', 'sans-serif'],
        heading: ['Amiri', 'serif'],
        sans: ['Tajawal', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
