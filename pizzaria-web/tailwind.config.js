/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#DC2626', hover: '#B91C1C', light: '#FEE2E2' },
        secondary: { DEFAULT: '#F97316', hover: '#EA580C', light: '#FFEDD5' },
        cream:     { DEFAULT: '#FFF7ED', dark: '#FEF3C7' },
        brand:     { dark: '#1C1917', gray: '#78716C' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
