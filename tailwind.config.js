/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#192a56',
          light: '#1c2e59',
          dark: '#152347'
        },
        secondary: {
          DEFAULT: '#21d397',
          light: '#27e9a7',
          dark: '#1cbe87'
        },
        accent: '#f7913a'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
