/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E9F7EF',
          100: '#D4F0DF',
          500: '#52A675',
          600: '#34D399',
          700: '#065F46',
          800: '#047857',
        },
        accent: {
          50: '#E0F2FE',
          100: '#B8E6FE',
          500: '#5A8FB4',
        }
      },
    },
  },
  plugins: [],
}
