/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f4f9',
          100: '#e1e9f3',
          200: '#c3d3e7',
          300: '#95b2d7',
          400: '#618bc2',
          500: '#3d6ba9',
          600: '#2b528c',
          700: '#224272',
          800: '#1e385e',
          900: '#1c314f',
          950: '#0f1c30',
        },
        navy: {
          800: '#0b132b',
          900: '#1c2541',
          950: '#0a0f1d',
        },
        gold: {
          500: '#D97706',
          600: '#B45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'card-hover': '0 12px 24px -4px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}
