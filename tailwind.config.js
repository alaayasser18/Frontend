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
          DEFAULT: '#243B53',
          light: '#334e68',
        },
        secondary: {
          DEFAULT: '#486581',
          light: '#829ab1',
        },
        accent: {
          DEFAULT: '#79B88B',
          light: '#e8f3eb',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#f5f7f8',
        },
        text: {
          main: '#243B53',
          muted: '#829ab1',
        }
      }
    },
  },
  plugins: [],
}
