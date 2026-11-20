/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0f1a30', 800: '#13203b', 700: '#182746', 600: '#22345a' },
        crimson: { DEFAULT: '#E0414A', dark: '#B8323A' },
        coral: '#F0A48A',
        neonGreen: '#10B981',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
