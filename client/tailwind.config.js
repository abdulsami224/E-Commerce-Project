/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',  // ← enables class-based dark mode
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Playfair Display'", 'serif'],
        body: ["'DM Sans'", 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#e63946',
          dark: '#ff6b6b',
        }
      }
    },
  },
  plugins: [],
};