/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        heartbeat: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(0.8)' },
        },

      },
      animation: {
        heartbeat: 'heartbeat 1s infinite',

      },
    },
  },
  plugins: [],
} 